function PasskeyRegistrationField(context) {
    // --- Testing Configuration ---
    // Set to 'true' to automatically proceed after successful registration.
    const ALLOW_AUTO_PROCEED = true;

    // --- UI elements and configuration variables ---
    let registerButton;
    let messageDiv;
    let continueButtonWrapper; // Wrapper for the continue button

    // --- Auth0 settings (from Params) ---
    let auth0Domain;
    let email;
    let myAccountAt;

    let passkeyRegisteredSuccessfully = false;

    // --- Helper functions ---
    function arrayBufferToBase64Url(buffer) {
        const bytes = new Uint8Array(buffer);
        let str = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    function base64UrlToArrayBuffer(base64url) {
        let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
            base64 += new Array(5 - pad).join('=');
        }
        const str = atob(base64);
        const buffer = new ArrayBuffer(str.length);
        let bytes = new Uint8Array(buffer);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return buffer;
    }

    function showMessage(text, isError = false) {
        if (messageDiv) {
            messageDiv.innerHTML = '';
            const iconSpan = document.createElement('span');
            iconSpan.className = 'message-icon';
            if (isError) {
                iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>`;
            } else {
                iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" /></svg>`;
            }
            const textNode = document.createTextNode(text);
            messageDiv.appendChild(iconSpan);
            messageDiv.appendChild(textNode);
            messageDiv.style.display = 'flex';
            messageDiv.classList.remove('info', 'error');
            messageDiv.classList.add(isError ? 'error' : 'info');
        }
    }

    // --- Passkey registration process ---
    async function handleRegisterPasskey() {
        showMessage('Starting passkey registration process...', false);
        if (registerButton) registerButton.disabled = true;

        try {
            const challengeResponse = await fetch(`https://${auth0Domain}/me/v1/authentication-methods`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${myAccountAt}`},
                body: JSON.stringify({ type: 'passkey' }),
            });

            if (!challengeResponse.ok) {
                const errorData = await challengeResponse.json();
                throw new Error(`Failed to retrieve challenge: ${errorData.error_description || JSON.stringify(errorData)}`);
            }

            const challengeData = await challengeResponse.json();
            const {authn_params_public_key, auth_session} = challengeData;

            const publicKeyCredentialCreationOptions = {
                challenge: base64UrlToArrayBuffer(authn_params_public_key.challenge),
                rp: authn_params_public_key.rp,
                user: {
                    id: base64UrlToArrayBuffer(authn_params_public_key.user.id),
                    name: authn_params_public_key.user.name,
                    displayName: authn_params_public_key.user.displayName,
                },
                pubKeyCredParams: authn_params_public_key.pubKeyCredParams,
                timeout: authn_params_public_key.timeout,
                attestation: authn_params_public_key.attestation,
                authenticatorSelection: {
                    requireResidentKey: true,
                    userVerification: 'preferred'
                },
                extensions: authn_params_public_key.extensions,
            };

            showMessage('Requesting passkey creation on your device...', false);

            const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });

            const authnResponse = {
                id: arrayBufferToBase64Url(credential.rawId),
                rawId: arrayBufferToBase64Url(credential.rawId),
                type: credential.type,
                authenticatorAttachment: credential.authenticatorAttachment,
                response: {
                    clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
                    attestationObject: arrayBufferToBase64Url(credential.response.attestationObject),
                },
            };

            const verifyResponse = await fetch(`https://${auth0Domain}/me/v1/authentication-methods/passkey|new/verify`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${myAccountAt}`},
                body: JSON.stringify({ auth_session: auth_session, authn_response: authnResponse }),
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(`Passkey verification failed: ${errorData.error_description || JSON.stringify(errorData)}`);
            }

            const verifyData = await verifyResponse.json();
            console.log('Passkey registration completed successfully:', verifyData);

            if (verifyData.id_token) {
                try {
                    const idToken = verifyData.id_token;
                    const payloadBase64Url = idToken.split('.')[1];
                    const payloadJson = atob(payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/'));
                    const payload = JSON.parse(payloadJson);
                    if (payload.sub) {
                        context.form.setHiddenField('enrolled_user_id', payload.sub);
                    }
                } catch (e) {
                    console.error('Failed to decode ID token:', e);
                }
            }
            
            showMessage('Passkey registered successfully!', false);
            passkeyRegisteredSuccessfully = true;
            
            if (registerButton) {
                registerButton.style.display = 'none';
            }

            if (ALLOW_AUTO_PROCEED) {
                showMessage('Success! Proceeding automatically...', false);
                setTimeout(() => {
                    if (context && context.form && typeof context.form.goForward === 'function') {
                        context.form.goForward();
                    }
                }, 1000); // 1-second delay
            } else {
                if (continueButtonWrapper) {
                    continueButtonWrapper.classList.add('visible');
                }
            }

        } catch (error) {
            console.error('An error occurred during passkey registration:', error);
            if (error.name === 'NotAllowedError') {
                showMessage('Passkey registration was cancelled. Click the button to try again.', false);
            } else {
                showMessage(`Passkey registration failed: ${error.message}`, true);
            }
            passkeyRegisteredSuccessfully = false;
        } finally {
            if (!passkeyRegisteredSuccessfully && registerButton) {
                registerButton.disabled = false;
            }
        }
    }

    // --- Auth0 Custom Field Component Interface ---
    return {
        init() {
            const configParams = context.custom.getParams();
            if (configParams && configParams.auth0Domain && configParams.email) {
                auth0Domain = configParams.auth0Domain;
                email = configParams.email;
                myAccountAt = configParams.myAccountAt;
            } else {
                const errorContainer = document.createElement('div');
                errorContainer.textContent = 'Custom Field Error: Required parameters are missing.';
                errorContainer.style.color = 'red';
                return errorContainer;
            }

            const container = document.createElement('div');
            container.className = 'passkey-container';
            
            registerButton = document.createElement('button');
            registerButton.type = 'button';
            registerButton.className = 'af-button af-nextButton';
            registerButton.addEventListener('click', handleRegisterPasskey);
            
            const textSpan = document.createElement('span');
            textSpan.className = 'af-button-text';
            textSpan.style.fontWeight = 'bold';
            textSpan.style.textAlign = 'center';
            textSpan.style.width = '100%';
            textSpan.textContent = 'Create a Passkey';

            registerButton.appendChild(textSpan);

            messageDiv = document.createElement('div');
            messageDiv.className = 'passkey-message';

            /*
            // --- MODIFICATION: Commented out the "Set a password instead" button ---
            const jumpButtonWrapper = document.createElement('div');
            jumpButtonWrapper.className = 'af-component af-block';
            jumpButtonWrapper.style.marginTop = '10px';

            const jumpButton = document.createElement('button');
            jumpButton.type = 'button';
            jumpButton.className = 'af-button af-jumpButton';
            jumpButton.style.backgroundColor = 'transparent';
            jumpButton.style.color = '#3F59E4'; // Blue color

            const jumpButtonText = document.createElement('span');
            jumpButtonText.className = 'af-button-text';
            jumpButtonText.style.fontWeight = 'bold';
            jumpButtonText.textContent = 'Set a password instead';

            jumpButton.appendChild(jumpButtonText);
            jumpButtonWrapper.appendChild(jumpButton);

            jumpButton.addEventListener('click', () => {
                console.log("'Set a password instead' clicked. Implement form jump logic here.");
                // Example: If you have a step named 'password-step', you would use:
                // if (context && context.form && typeof context.form.jumpTo === 'function') {
                //     context.form.jumpTo('password-step');
                // }
            });
            */

            continueButtonWrapper = document.createElement('div');
            continueButtonWrapper.className = 'continue-button-wrapper';

            const continueButton = document.createElement('button');
            continueButton.type = 'button';
            continueButton.className = 'af-button af-nextButton'; 

            const continueButtonText = document.createElement('span');
            continueButtonText.className = 'af-button-text';
            continueButtonText.textContent = 'Continue';

            continueButton.appendChild(continueButtonText);

            continueButton.addEventListener('click', () => {
                if (context && context.form && typeof context.form.goForward === 'function') {
                    context.form.goForward();
                } else {
                    console.error('form.goForward() is not available in this context.');
                }
            });
            
            continueButtonWrapper.appendChild(continueButton);

            container.appendChild(registerButton);
            // container.appendChild(jumpButtonWrapper); // The jump button is no longer added
            container.appendChild(messageDiv);
            container.appendChild(continueButtonWrapper);

            return container;
        },

        block() {
            if (registerButton) registerButton.disabled = true;
        },

        unblock() {
            if (registerButton && !passkeyRegisteredSuccessfully) {
                registerButton.disabled = false;
            }
        },
    };
}
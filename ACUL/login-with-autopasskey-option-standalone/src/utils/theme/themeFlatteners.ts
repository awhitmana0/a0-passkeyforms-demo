/**
 * Simplified theme flatteners for standalone operation
 * Converts Auth0 branding data structures into CSS custom properties
 */

/**
 * Flatten color data to CSS variables
 */
export function flattenColors(colors: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (colors.primary_button)
    result["--ul-theme-color-primary-button"] = colors.primary_button;
  if (colors.primary_button_label)
    result["--ul-theme-color-primary-button-label"] =
      colors.primary_button_label;
  if (colors.secondary_button_border)
    result["--ul-theme-color-secondary-button-border"] =
      colors.secondary_button_border;
  if (colors.secondary_button_label)
    result["--ul-theme-color-secondary-button-label"] =
      colors.secondary_button_label;
  if (colors.base_focus_color)
    result["--ul-theme-color-base-focus-color"] = colors.base_focus_color;
  if (colors.base_hover_color)
    result["--ul-theme-color-base-hover-color"] = colors.base_hover_color;
  if (colors.links_focused_components)
    result["--ul-theme-color-links-focused-components"] =
      colors.links_focused_components;
  if (colors.header) result["--ul-theme-color-header"] = colors.header;
  if (colors.body_text) result["--ul-theme-color-body-text"] = colors.body_text;
  if (colors.widget_background)
    result["--ul-theme-color-widget-background"] = colors.widget_background;
  if (colors.widget_border)
    result["--ul-theme-color-widget-border"] = colors.widget_border;
  if (colors.input_labels_placeholders)
    result["--ul-theme-color-input-labels-placeholders"] =
      colors.input_labels_placeholders;
  if (colors.input_filled_text)
    result["--ul-theme-color-input-filled-text"] = colors.input_filled_text;
  if (colors.input_border)
    result["--ul-theme-color-input-border"] = colors.input_border;
  if (colors.input_filled_background)
    result["--ul-theme-color-input-filled-background"] =
      colors.input_filled_background;
  if (colors.icons) result["--ul-theme-color-icons"] = colors.icons;
  if (colors.focused_input_border)
    result["--ul-theme-color-focused-input-border"] =
      colors.focused_input_border;
  if (colors.error) result["--ul-theme-color-error"] = colors.error;
  if (colors.success) result["--ul-theme-color-success"] = colors.success;

  return result;
}

/**
 * Flatten border data to CSS variables
 */
export function flattenBorders(borders: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (borders.button_border_radius) {
    const radius = typeof borders.button_border_radius === 'number' 
      ? `${borders.button_border_radius}px` 
      : borders.button_border_radius;
    result["--ul-theme-border-button-border-radius"] = radius;
  }
  
  if (borders.button_border_weight) {
    const weight = typeof borders.button_border_weight === 'number' 
      ? `${borders.button_border_weight}px` 
      : borders.button_border_weight;
    result["--ul-theme-border-button-border-weight"] = weight;
  }
  
  if (borders.buttons_style)
    result["--ul-theme-border-buttons-style"] = borders.buttons_style;
  if (borders.input_border_radius) {
    const radius = typeof borders.input_border_radius === 'number' 
      ? `${borders.input_border_radius}px` 
      : borders.input_border_radius;
    result["--ul-theme-border-input-border-radius"] = radius;
  }
  
  if (borders.input_border_weight) {
    const weight = typeof borders.input_border_weight === 'number' 
      ? `${borders.input_border_weight}px` 
      : borders.input_border_weight;
    result["--ul-theme-border-input-border-weight"] = weight;
  }
  
  if (borders.inputs_style)
    result["--ul-theme-border-inputs-style"] = borders.inputs_style;
  if (borders.show_widget_shadow !== undefined)
    result["--ul-theme-border-show-widget-shadow"] = borders.show_widget_shadow.toString();
  if (borders.widget_border_weight) {
    const weight = typeof borders.widget_border_weight === 'number' 
      ? `${borders.widget_border_weight}px` 
      : borders.widget_border_weight;
    result["--ul-theme-border-widget-border-weight"] = weight;
  }
  
  if (borders.widget_corner_radius) {
    const radius = typeof borders.widget_corner_radius === 'number' 
      ? `${borders.widget_corner_radius}px` 
      : borders.widget_corner_radius;
    result["--ul-theme-border-widget-corner-radius"] = radius;
  }

  return result;
}

/**
 * Flatten font data to CSS variables with unit conversion
 */
export function flattenFonts(fonts: any): Record<string, string> {
  const result: Record<string, string> = {};

  // Helper to convert percentage to rem
  const convertFontSize = (value: any): string => {
    if (typeof value === 'string' && value.endsWith('%')) {
      const percentage = parseFloat(value.replace('%', ''));
      return `${percentage / 100}rem`;
    }
    if (typeof value === 'number') {
      return `${value / 100}rem`;
    }
    return value;
  };

  // Helper to convert boolean weight to number
  const convertFontWeight = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? '700' : '400';
    }
    return value?.toString() || '400';
  };

  if (fonts.reference_text_size)
    result["--ul-theme-font-reference-text-size"] = convertFontSize(fonts.reference_text_size);
  if (fonts.body_text_size)
    result["--ul-theme-font-body-text-size"] = convertFontSize(fonts.body_text_size);
  if (fonts.buttons_text_size)
    result["--ul-theme-font-buttons-text-size"] = convertFontSize(fonts.buttons_text_size);
  if (fonts.input_labels_size)
    result["--ul-theme-font-input-labels-size"] = convertFontSize(fonts.input_labels_size);
  if (fonts.links_size)
    result["--ul-theme-font-links-size"] = convertFontSize(fonts.links_size);
  if (fonts.title_size)
    result["--ul-theme-font-title-size"] = convertFontSize(fonts.title_size);
  if (fonts.subtitle_size)
    result["--ul-theme-font-subtitle-size"] = convertFontSize(fonts.subtitle_size);

  // Font weights
  if (fonts.body_text_bold !== undefined)
    result["--ul-theme-font-body-text-weight"] = convertFontWeight(fonts.body_text_bold);
  if (fonts.buttons_text_bold !== undefined)
    result["--ul-theme-font-buttons-text-weight"] = convertFontWeight(fonts.buttons_text_bold);
  if (fonts.input_labels_bold !== undefined)
    result["--ul-theme-font-input-labels-weight"] = convertFontWeight(fonts.input_labels_bold);
  if (fonts.links_bold !== undefined)
    result["--ul-theme-font-links-weight"] = convertFontWeight(fonts.links_bold);
  if (fonts.title_bold !== undefined)
    result["--ul-theme-font-title-weight"] = convertFontWeight(fonts.title_bold);
  if (fonts.subtitle_bold !== undefined)
    result["--ul-theme-font-subtitle-weight"] = convertFontWeight(fonts.subtitle_bold);

  // Font families
  if (fonts.body_url) result["--ul-theme-font-body-url"] = `"${fonts.body_url}"`;
  if (fonts.buttons_url) result["--ul-theme-font-buttons-url"] = `"${fonts.buttons_url}"`;
  if (fonts.input_labels_url) result["--ul-theme-font-input-labels-url"] = `"${fonts.input_labels_url}"`;
  if (fonts.links_url) result["--ul-theme-font-links-url"] = `"${fonts.links_url}"`;
  if (fonts.title_url) result["--ul-theme-font-title-url"] = `"${fonts.title_url}"`;
  if (fonts.subtitle_url) result["--ul-theme-font-subtitle-url"] = `"${fonts.subtitle_url}"`;

  return result;
}

/**
 * Flatten page background data to CSS variables
 */
export function flattenPageBackground(pageBackground: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (pageBackground.background_color)
    result["--ul-theme-page-bg-background-color"] = pageBackground.background_color;
  if (pageBackground.background_image_url)
    result["--ul-theme-page-bg-background-image-url"] = `"${pageBackground.background_image_url}"`;
  if (pageBackground.page_layout)
    result["--ul-theme-page-bg-page-layout"] = pageBackground.page_layout;

  return result;
}

/**
 * Flatten widget data to CSS variables
 */
export function flattenWidget(widget: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (widget.logo_url) result["--ul-theme-widget-logo-url"] = `"${widget.logo_url}"`;
  if (widget.logo_height) {
    const height = typeof widget.logo_height === 'number' 
      ? `${widget.logo_height}px` 
      : widget.logo_height;
    result["--ul-theme-widget-logo-height"] = height;
  }
  if (widget.logo_position)
    result["--ul-theme-widget-logo-position"] = widget.logo_position;
  if (widget.header_text_alignment)
    result["--ul-theme-widget-header-text-alignment"] = widget.header_text_alignment;
  if (widget.social_buttons_layout)
    result["--ul-theme-widget-social-buttons-layout"] = widget.social_buttons_layout;

  return result;
}
/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * The .Header class is the wrapping class that aligns all the items properly and gives the header
 * it's dark background.
 * Each direct child of the .Header component is expected to be a .Header-item component.
 * The component utilizes flexbox CSS to align all these items properly and applies spacing scale margin.
 * https://primer.style/css/components/header
 */
export const HEADER = "Header";
/**
 * All items directly under the .Header component should be a .Header-item component.
 * Inside these components can be anything (text, forms, images...), and the .Header-item
 * component will make sure these elements vertically align with each other.
 * .Header-item elements have a built-in margin that will need to be overridden
 * with the mr-0 utility class for the last element in the container.
 * We relied on the utility classes here instead of :last-child because the last child isn't always the item visible.
 * On responsive pages, there's a mobile menu that gets presented to the user at smaller breakpoints.
 * https://primer.style/css/components/header
 */
export const HEADER_ITEM = "Header-item";
/**
 * Add the .Header-link class to any anchor tags in the header to give them consistent styling and hover opacity.
 * This class makes the links white, bold and 70% fade on hover.
 * https://primer.style/css/components/header
 */
export const HEADER_LINK = "Header-link";

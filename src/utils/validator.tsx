/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export function validateEmail(email: string) {
    const regex = new RegExp (['^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
                            '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
                            "[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+",
                            "[a-zA-Z]{2,}))$"].join(""));

    return regex.test(email);
}

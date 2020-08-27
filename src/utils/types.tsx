/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export interface IStringTMap<T> { [key: string]: T; }
export interface INumberTMap<T> { [key: number]: T; }

export interface IStringAnyMap extends IStringTMap<any> {}
export interface INumberAnyMap extends INumberTMap<any> {}

export interface IStringStringMap extends IStringTMap<string> {}
export interface INumberStringMap extends INumberTMap<string> {}

export interface IStringNumberMap extends IStringTMap<number> {}
export interface INumberNumberMap extends INumberTMap<number> {}

export interface IStringBooleanMap extends IStringTMap<boolean> {}
export interface INumberBooleanMap extends INumberTMap<boolean> {}

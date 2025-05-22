import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

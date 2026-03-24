/**
 * Page (CMS) Module
 *
 * Manages static pages (About, Contact, FAQ, etc.)
 *
 * @see PROJECT_PLAN.md T2.7
 */

import { Module } from "@medusajs/framework/utils"
import PageModuleService from "./service"

export const PAGE_MODULE = "page"

export default Module(PAGE_MODULE, {
  service: PageModuleService,
})

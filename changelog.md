# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.2] - 2019-08-30
### Changed
- `lib/button.js`: changed `white-space` property so buttons don't overflow their containers

## [0.5.1] - 2019-08-30
### Changed
- `lib/button.js`: added `:disabled` styling for buttons

## [0.5.0] - 2019-08-19
### Added
- `lib/live-announcer.js`: aria-live announcer components for Notification a11y
- `lib/notification.js`: `Notification`, `NotificationsContainer`, `NotificationsProvider` components; `useNotifications` hook
- `lib/progress.js`: `Progress` component
### Changed
- `lib/button.js`: add margin for CTA button (to account for shadow)
- `lib/themes.js`: update theme colors for contrast a11y

## [0.4.0] - 2019-08-19
### Added
- `lib/button-group.js`: `ButtonGroup` and `SegmentedButton` components
### Changed
- `lib/button.js`: add "active" state for buttons

## [0.3.0] - 2019-08-16
### Added
- `lib/badge.js` - `Badge` component
- `SearchResults` & `ResultsList` components
- update `AnimationContainer` to handle reduced motion

## [0.2.0]
### Added
- `lib/animation-container.js`: `AnimationContainer` component, `slideUp` and `slideDown` animations
- `lib/checkbox-button.js`:  `CheckboxButton` component
- `lib/icon-button.js`: `IconButton` component
- `lib/overlay.js`: `Overlay` component
- `lib/popover.js`: `Popover` component
- `lib/block.js`: `Info`, `Actions`, and `DangerZone` blocks for overlays and popovers

## [0.1.1] - 2019-07-31
### Added
- created a changelog
- `server/changelog.js`: script to populate the changelog with a new entry, including stubs for each changed file

## [0.1.0] - 2019-07-31
### Added
- initial release: `Avatar`, `Button`, `Icon`, `Loader`, `TextInput`, `TextArea` components, `createRemoteComponent` helper
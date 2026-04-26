<div align="center">
    <img src="desktopIcon.png" alt="Jeb's Progress Log logo" height="100">

# Jeb's Progress Log

[![GitHub stars][stars-shield]][stars-url]
[![GitHub contributors][contributors-shield]][contributors-url]
[![GitHub issues][issues-shield]][issues-url]
[![License: MIT][license-shield]][license-url]

A desktop application to track and visualize science progression across your Kerbal Space Program career and science-mode saves.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Why a Desktop App and Not a Mod?](#why-a-desktop-app-and-not-a-mod)
- [How It Works](#how-it-works)
    - [Limitations](#limitations)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running in Development](#running-in-development)
- [Building for Production](#building-for-production)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**Jeb's Progress Log** is a desktop companion for **Kerbal Space Program** that parses your save files and presents a clean, navigable overview of the science you have collected and the science you still have left to gather. It is the spiritual successor to a previous prototype of mine, rebuilt from scratch on a more modern stack (Electron + React + TypeScript) with a stronger focus on code quality, maintainability and UX.

This project is currently under active development. Most features described below are planned or in progress.

## Features

- **Save discovery** — automatically locates KSP saves on your system and lists them for selection.
- **Science breakdown** — per-celestial-body view of completed experiments and remaining science points.
- **Tabbed interface** — one tab per body, with biome and situation-level detail.
- **Persistent settings** — remembers your KSP install path and user preferences between sessions.
- **Cross-platform builds** — packaging targets for Windows, macOS and Linux out of the box.

## Why a Desktop App and Not a Mod?

A KSP mod would be the technically superior solution: it could update live as experiments are completed in-game, and could be made compatible with modded planets and experiments — see, for example, [\[x\] Science! Continued](https://forum.kerbalspaceprogram.com/topic/182683-ksp-190-x-science-continued-ksp-science-report-and-checklist-v523/).

This project takes a different path for two reasons:

1. I am more comfortable with web/desktop tooling than with KSP's modding ecosystem.
2. The project doubles as a way to deepen my experience with Electron and TypeScript on a real, non-trivial application.

The original inspiration comes from [nic_name's KSP Science Checklist](https://forum.kerbalspaceprogram.com/topic/211219-ksp-science-checklist-v30/), which compiled the stock science catalog into a spreadsheet.

## How It Works

The application reads the `saves` folder of your KSP installation, parses the `.sfs` save files, and cross-references the recorded science entries against a known catalog of stock experiments, celestial bodies, biomes and situations. The result is rendered as an interactive UI that lets you drill down from a planet overview into specific biomes and experiments.

### Limitations

- **Not real-time.** The app reads files on disk; it cannot observe the running game. To see new science you must save in KSP and refresh the app.
- **Stock content only.** Only vanilla celestial bodies, biomes and experiments are supported.
- **Mod compatibility is best-effort.** Mods that introduce new experiments or bodies may produce unknown entries. The app is designed to ignore unknown records gracefully, but this is not exhaustively tested. Mods that change the on-disk format of vanilla science records may break parsing.

## Tech Stack

- **[Electron](https://www.electronjs.org/)** — desktop application shell.
- **[React](https://react.dev/)** — UI layer.
- **[TypeScript](https://www.typescriptlang.org/)** — type safety across both the main and renderer processes.
- **[Vite](https://vitejs.dev/)** — renderer-side dev server and bundler.
- **[electron-builder](https://www.electron.build/)** — packaging and distributable builds.
- **ESLint + Prettier** — linting and formatting.

## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** 20 LTS or newer
- **npm** (bundled with Node.js)
- A working **Kerbal Space Program** installation if you want to test against real save data

### Installation

```sh
git clone https://github.com/Riki9811/jebs-progress-log.git
cd jebs-progress-log
npm install
```

### Running in Development

```sh
npm run dev
```

This starts the Vite dev server for the renderer and launches Electron against it in parallel, with hot reload for the React side.

## Building for Production

Distributable builds are produced via `electron-builder`:

```sh
npm run dist:win      # Windows  (x64)
npm run dist:mac      # macOS    (arm64)
npm run dist:linux    # Linux    (x64)
```

Artifacts are emitted into the `dist/` directory.

## Scripts

| Script                       | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                | Run the app in development mode (Vite + Electron, parallel).        |
| `npm run dev:react`          | Start the Vite dev server for the React renderer.                   |
| `npm run dev:electron`       | Transpile the main process and launch Electron with `NODE_ENV=dev`. |
| `npm run build`              | Type-check the project and produce a production renderer build.     |
| `npm run lint`               | Run ESLint over the codebase.                                       |
| `npm run format`             | Apply Prettier formatting to the whole project.                     |
| `npm run preview`            | Preview the built renderer with Vite.                               |
| `npm run transpile:electron` | Transpile electron process into JavaScript.                         |
| `npm run dist:win`           | Build and package a Windows installer.                              |
| `npm run dist:mac`           | Build and package a macOS distributable (arm64).                    |
| `npm run dist:linux`         | Build and package a Linux distributable (x64).                      |

## Roadmap

- [ ] Save discovery and selection
- [ ] `.sfs` parser for science records
- [ ] Stock science catalog (bodies, biomes, situations, experiments)
- [ ] Per-body tabbed UI
- [ ] Settings persistence
- [ ] Windows release
- [ ] macOS and Linux releases

## License

Distributed under the MIT License. See [`LICENSE.txt`](./LICENSE.txt) for details.

<!-- LINKS -->

[stars-shield]: https://img.shields.io/github/stars/Riki9811/jebs-progress-log.svg?style=for-the-badge
[stars-url]: https://github.com/Riki9811/jebs-progress-log/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/Riki9811/jebs-progress-log.svg?style=for-the-badge
[contributors-url]: https://github.com/Riki9811/jebs-progress-log/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/Riki9811/jebs-progress-log.svg?style=for-the-badge
[issues-url]: https://github.com/Riki9811/jebs-progress-log/issues
[license-shield]: https://img.shields.io/github/license/Riki9811/jebs-progress-log.svg?style=for-the-badge
[license-url]: https://github.com/Riki9811/jebs-progress-log/blob/main/LICENSE.txt

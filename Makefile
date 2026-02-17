.PHONY: help install dev start build prod lint format test clean docker-up docker-down docker-logs migrate seed release

# Default target
help:
	@echo "NestJS Boilerplate - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "Setup:"
	@echo "  make install        - Install dependencies"
	@echo "  make setup          - Install deps and copy env file"
	@echo ""
	@echo "Development:"
	@echo "  make dev            - Start development server (watch mode)"
	@echo "  make dev-swc        - Start dev server with SWC (faster)"
	@echo "  make debug          - Start dev server with debugger"
	@echo ""
	@echo "Build & Production:"
	@echo "  make build          - Build the application"
	@echo "  make build-swc      - Build with SWC (faster)"
	@echo "  make prod           - Run production build"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint           - Run ESLint and fix issues"
	@echo "  make lint-check     - Run ESLint without fixing"
	@echo "  make format         - Format code with Prettier"
	@echo "  make typecheck      - Run TypeScript type checking"
	@echo ""
	@echo "Testing:"
	@echo "  make test           - Run unit tests"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-cov       - Run tests with coverage"
	@echo "  make test-e2e       - Run e2e tests"
	@echo ""
	@echo "Database:"
	@echo "  make migrate-gen    - Generate new migration"
	@echo "  make migrate        - Run migrations"
	@echo "  make migrate-revert - Revert last migration"
	@echo "  make seed           - Run database seeds"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up      - Start Docker containers"
	@echo "  make docker-down    - Stop Docker containers"
	@echo "  make docker-logs    - View Docker logs"
	@echo "  make docker-build   - Build Docker image"
	@echo ""
	@echo "Release:"
	@echo "  make release        - Create a new release"
	@echo "  make release-minor  - Create a minor release"
	@echo "  make release-major  - Create a major release"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          - Remove build artifacts"

# Setup
install:
	pnpm install

setup: install
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env file"; fi

# Development
dev:
	pnpm run dev

dev-swc:
	pnpm run start:swc

debug:
	pnpm run start:debug

start:
	pnpm run start

# Build & Production
build:
	pnpm run build

build-swc:
	pnpm run build:swc

prod:
	pnpm run start:prod

# Code Quality
lint:
	pnpm run lint

lint-check:
	pnpm run lint:check

format:
	pnpm run format

typecheck:
	pnpm run typecheck

# Testing
test:
	pnpm run test

test-watch:
	pnpm run test:watch

test-cov:
	pnpm run test:cov

test-e2e:
	pnpm run test:e2e

# Database
migrate-gen:
	pnpm run migration:generate

migrate:
	pnpm run migration:run

migrate-revert:
	pnpm run migration:revert

seed:
	pnpm run seed

# Docker
docker-up:
	pnpm run docker:dev

docker-down:
	pnpm run docker:down

docker-logs:
	pnpm run docker:logs

docker-build:
	docker build -t nestjs-boilerplate .

# Release
release:
	pnpm run release

release-minor:
	pnpm run release:minor

release-major:
	pnpm run release:major

# Utilities
clean:
	rm -rf dist node_modules/.cache coverage

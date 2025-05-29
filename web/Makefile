VERSION  := v0.1.0
GIT_HASH := $(shell git rev-parse --short HEAD)
SRC      := $(shell find . -type f -name '*.tsx' -not -path "./.next/*" -not -path "./node_modules/*")
CURR_DIR := $(shell pwd)

.PHONY: help
help: ### Display this help screen.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: lint
lint: ### Improve your code style.
	@npm run lint

.PHONY: local_run
local_run: lint ### Run the application locally.
	@npm run dev

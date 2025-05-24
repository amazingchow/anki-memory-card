include .env.infra
export

CURR_DIR		:= $(shell pwd)

#################################
# HELP
#################################

.PHONY: help
help: ### Display this help screen.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

#################################
# RUNNING INFRASTRUCTURE
#################################

.PHONY: run_infra
run_infra: ## Run infra (docker-compose)
	@docker compose down -v --remove-orphans
	@docker compose up -d cache

.PHONY: shutdown_infra
shutdown_infra: ## Shutdown infra (docker-compose)
	@docker-compose down

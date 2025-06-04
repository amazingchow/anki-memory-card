include .env
export

VERSION 		:= v0.1.0
GIT_HASH		:= $(shell git rev-parse --short HEAD)
SRC_FILES   	:= $(shell find . -type f -name '*.py' \
	-not -path "./venv/*" \
	-not -path "./.venv/*" \
	-not -path "./migrations*/versions/*" \
)
TEST_FILE 		:= tests/unit_tests/
MYPY_CACHE      := .mypy_cache
CURR_DIR		:= $(shell pwd)

#################################
# HELP
#################################

.PHONY: help
help: ### Display this help screen.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

#################################
# LINTING AND FORMATTING
#################################

.PHONY: lint format
lint format: ### Improve your code style. (ruff)
	@uv run ruff check --fix $(PYTHON_FILES)
	@uv run ruff format $(PYTHON_FILES)

#################################
# RUNNING APPLICATION
#################################

.PHONY: local_run
local_run: lint ### Run the application locally.
	@uv run uvicorn \
		--app-dir=. \
		--host="0.0.0.0" \
		--port=8000 \
		--workers=1 \
		--loop="uvloop" \
		--http="httptools" \
		--interface="asgi3" \
		--limit-concurrency=1024 \
		--timeout-keep-alive=300 \
		--timeout-graceful-shutdown=2 \
		--reload \
		app:app

.PHONY: local_run_celery_worker
local_run_celery_worker: ### Run the celery worker locally.
	@uv run celery \
		--workdir=./ \
		--app=celery_worker.celery_inst worker \
		--concurrency=1 \
		--pool=prefork \
		--loglevel=DEBUG

#################################
# TESTING
#################################

.PHONY: test
test: ### Run unit tests.
	@(export PYTHONPATH=${PYTHONPATH}:${CURR_DIR} && \
		uv run --with-editable . pytest -vv $(TEST_FILE))

.PHONY: test_watch
test_watch: ### Run unit tests in watch mode.
	@(export PYTHONPATH=${PYTHONPATH}:${CURR_DIR} && \
		uv run --with-editable . ptw --snapshot-update --now . -- -vv tests/unit_tests)

#################################
# RUNNING INFRA
#################################

.PHONY: run_infra
run_infra: ## Run infra
	@(docker-compose -f "${CURR_DIR}/infra.yml" up -d)

.PHONY: shutdown_infra
shutdown_infra: ## Shutdown infra
	@(docker-compose -f "${CURR_DIR}/infra.yml" down)

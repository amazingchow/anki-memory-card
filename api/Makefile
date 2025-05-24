include .env
export

VERSION 		:= v0.1.0
GIT_HASH		:= $(shell git rev-parse --short HEAD)
PYTHON_FILES   	:= $(shell find . -type f -name '*.py' \
	-not -path "./venv/*" \
	-not -path "./.venv/*" \
	-not -path "./src/migrations*/versions/*" \
)
CURR_DIR		:= $(shell pwd)
TEST_FILE 		:= $(CURR_DIR)/src/tests/unit_tests/

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
lint format: ### Lint and format the code.
	@uv run ruff check --fix $(PYTHON_FILES)
	@uv run ruff format $(PYTHON_FILES)

#################################
# RUNNING APPLICATION
#################################

.PHONY: local_run
local_run: lint ### Run the API server locally.
	@uv run uvicorn \
		--app-dir=./src \
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
local_run_celery_worker: ### Run the Celery worker locally.
	@uv run celery \
		--workdir=./src \
		--app=celery_worker.celery_inst worker \
		--concurrency=1 \
		--pool=prefork \
		--loglevel=DEBUG

#################################
# TESTING
#################################

.PHONY: test
test: ### Run unit tests. (pytest)
	@(export PYTHONPATH=${PYTHONPATH}:${CURR_DIR}/src && \
		uv run --with-editable . pytest -vv $(TEST_FILE))

#################################
# CLEANING
#################################
.PHONY: clean
clean: ### Clean the cache.
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@find . -type d -name ".pytest_cache" -exec rm -rf {} +
	@find . -type d -name ".ruff_cache" -exec rm -rf {} +

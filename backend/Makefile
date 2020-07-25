IMAGE := docker.io/mtinside/hlnl-be
TAG := latest

init:
	npm install

dev:
	deno run --allow-net --allow-env --allow-read index.ts

docker-build:
	docker build . -t $(IMAGE):$(TAG)

docker-run: docker-build
	docker run -ti --rm --name hlnl-be \
	    -p4000:4000 \
	    $(IMAGE):$(TAG)

docker-push: docker-build
	docker push $(IMAGE):$(TAG)

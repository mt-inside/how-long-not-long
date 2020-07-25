IMAGE := docker.io/mtinside/hlnl-fe
TAG := latest

init:
	yarn install

dev:
	yarn dev

render:
	yarn build

render-docker: render
	docker build . -t $(IMAGE):$(TAG)

docker-push: render-docker
	docker push $(IMAGE):$(TAG)

run-docker: render-docker
	docker run -ti --rm --name hlnl-fe \
	    -p8080:80 \
	    $(IMAGE):$(TAG)

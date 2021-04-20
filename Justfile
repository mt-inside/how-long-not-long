IMAGE := "docker.io/mtinside/hlnl"
TAG := "0.1.0"

default:
	@just --list

init:
	yarn install

dev:
	yarn dev

render:
	yarn build

image: render
	docker build . -t {{IMAGE}}:{{TAG}}

# Push to dockerhub
image-push: image
	docker push {{IMAGE}}:{{TAG}}

image-run: image
	docker run -ti --rm -p8080:80 {{IMAGE}}:{{TAG}}

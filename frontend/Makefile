init:
	yarn install

dev:
	yarn dev

render:
	yarn build

render-docker: render
	docker build . -t docker.io/mt-inside/hlnl

run-docker: render-docker
	docker run -ti --rm --name not-long \
	    -p8080:80 \
	    docker.io/mt-inside/hlnl

.PHONY: dev, build, serve

dev:
	pnpm run dev

build:
	pnpm run build

serve:
	python src/server/app.py

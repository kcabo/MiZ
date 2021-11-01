# AWS LambdaにコンテナデプロイするためのDockerfile
# TODO: マルチステージビルド・CI/CD

FROM public.ecr.aws/lambda/nodejs:14

ENV NODE_ENV production

COPY ./dist ./

CMD [ "index.handler" ]
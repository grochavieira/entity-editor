FROM java:8

WORKDIR /

ADD SEPAEngine_0.9.7.jar SEPAEngine_0.9.7.jar
ADD virtuoso.jpar virtuoso.jpar
ADD blazegraph.jpar blazegraph.jpar
ADD engine.jpar engine.jpar
ADD log4j2.xml log4j2.xml


ENV SEPA_ENV_ENDPOINT=${SEPA_ENV_ENDPOINT}
ENV SEPA_ENV_ENDPOINT_HOST=${SEPA_ENV_ENDPOINT_HOST}


EXPOSE 8000
EXPOSE 9000

CMD java -jar SEPAEngine_0.9.7.jar
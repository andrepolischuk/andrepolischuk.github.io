# Tools for frontend monitoring with Prometheus

_February 28, 2024_

Developers widely use [Prometheus](https://prometheus.io) as a system for operational monitoring and alerting for their projects. Here is a list of tools for monitoring frontend services with Prometheus.

Prometheus uses a pull model, meaning it periodically pulls metrics from the service endpoint via HTTP. For monitoring, a service should provide the following:

1. Collect metrics
2. Accumulate metrics
3. Export metrics for delivery from an endpoint to Prometheus.

For these purposes, you can use one of the open-source clients:

## [prom-client](https://github.com/siimon/prom-client)

Prometheus client for Node.js, which covers all three above-mentioned conditions and supports histograms, summaries, gauges, and counters. It is used in Node.js APIs and also in applications with server-side rendering.

## [prometheus-browser](https://github.com/ruanyl/prometheus-browser)

Prometheus client for browsers, supporting the collection of metrics in browser services, for example, SPAs. It supports most metrics: histograms, gauges, and counters.

You need to store metrics from browsers somewhere, as Prometheus cannot pull metrics from there. For this, you can use one of the intermediate gateways that support the push model.

## [Pushgateway](https://github.com/prometheus/pushgateway)

Intermediate gateway to push metrics from services where, for some reason, is not possible to support the pull model.

Pushgateway has a [limited area](https://prometheus.io/docs/practices/pushing/) of application. It does not support aggregation and can mainly be used as a cache of metrics. Metrics in it will be stored in the same way as they were in the service from which the metrics were collected.

## [Aggregation Gateway](https://github.com/zapier/prom-aggregation-gateway)

Another intermediate gateway for Prometheus, but unlike the previous one with built-in aggregation of metrics. It can be used for monitoring a large number of distributed metrics.

It solves the problem of collecting metrics in the browser. A browser application can accumulate metrics within the scope of a single user session, which is X times greater than the instances of Node.js applications. The aggregating gateway sums up these individual short-lived metrics so that Prometheus can calculate changes in metrics over time.

## Conclusion

These tools fully cover the collection of metrics to Prometheus for operational monitoring of frontend services. For further reading, I recommend also checking out:

* [Prometheus](https://prometheus.io/docs/introduction/overview/)
* [Prometheus Client for Node.js](https://github.com/siimon/prom-client)
* [Prometheus Browser](https://github.com/ruanyl/prometheus-browser)
* [Pushgateway](https://github.com/prometheus/pushgateway)
* [Aggregation Gateway](https://github.com/zapier/prom-aggregation-gateway)
* [A curated list of awesome Prometheus resources, projects and tools](https://github.com/roaldnefs/awesome-prometheus)

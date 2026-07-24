\# ☁️ CloudCart — Production-Style DevOps Platform on AWS EKS



CloudCart is a cloud-native microservices project built to demonstrate a complete DevOps workflow on AWS.



The project deploys four containerized Node.js microservices to an Amazon EKS Kubernetes cluster and implements automated CI/CD, GitOps deployment, container security scanning, monitoring, and centralized logging.



The goal of this project is not the complexity of the application itself, but the infrastructure and DevOps practices used to build, deploy, secure, observe, and manage it.



\---



\## 🏗️ Architecture



```text

&#x20;                        ┌──────────────────────┐

&#x20;                        │      Developer       │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                                 Git Push

&#x20;                                   │

&#x20;                                   ▼

&#x20;                        ┌──────────────────────┐

&#x20;                        │       GitHub         │

&#x20;                        │   cloudcart-apps     │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                                   ▼

&#x20;                        ┌──────────────────────┐

&#x20;                        │       Jenkins        │

&#x20;                        │      CI Pipeline     │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                ┌──────────────────┼──────────────────┐

&#x20;                │                  │                  │

&#x20;                ▼                  ▼                  ▼

&#x20;         Build Images        Trivy Scan        Push Images

&#x20;           (Kaniko)                            to Docker Hub

&#x20;                │

&#x20;                └──────────────────┬──────────────────┘

&#x20;                                   │

&#x20;                                   ▼

&#x20;                        ┌──────────────────────┐

&#x20;                        │       GitHub         │

&#x20;                        │ cloudcart-manifests  │

&#x20;                        │   Image Tag Update   │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                                   ▼

&#x20;                        ┌──────────────────────┐

&#x20;                        │       Argo CD        │

&#x20;                        │       GitOps         │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                                   ▼

&#x20;                   ┌─────────────────────────────┐

&#x20;                   │        Amazon EKS           │

&#x20;                   │                             │

&#x20;                   │  ┌───────────────────────┐  │

&#x20;                   │  │    NGINX Ingress      │  │

&#x20;                   │  └───────────┬───────────┘  │

&#x20;                   │              │              │

&#x20;                   │   ┌──────────┼──────────┐   │

&#x20;                   │   │          │          │   │

&#x20;                   │ User      Product     Order │

&#x20;                   │ Service   Service     Service│

&#x20;                   │              │              │

&#x20;                   │         Payment Service     │

&#x20;                   └─────────────────────────────┘



&#x20;                             Observability

&#x20;                                   │

&#x20;               ┌───────────────────┴───────────────────┐

&#x20;               │                                       │

&#x20;               ▼                                       ▼

&#x20;       Prometheus → Grafana                   Promtail → Loki

&#x20;                                                      │

&#x20;                                                      ▼

&#x20;                                                   Grafana

```



\---



\## 🛠️ Tech Stack



| Category | Technologies |

|---|---|

| Cloud | AWS |

| Container Orchestration | Kubernetes, Amazon EKS |

| Containers | Docker, Kaniko |

| CI/CD | Jenkins |

| GitOps | Argo CD |

| Security | Trivy |

| Ingress | NGINX Ingress Controller |

| Monitoring | Prometheus, Grafana |

| Logging | Loki, Promtail, Grafana |

| Version Control | Git, GitHub |

| Application | Node.js, Express |

| Package Management | Helm |



\---



\## 🔧 Microservices



CloudCart consists of four lightweight Node.js/Express services.



| Service | Purpose | Container Port |

|---|---|---:|

| User Service | User-facing service and health endpoint | 3000 |

| Product Service | Product API | 3000 |

| Order Service | Order API | 3000 |

| Payment Service | Mock payment API | 3000 |



Each service is independently containerized using its own Dockerfile and deployed as a Kubernetes workload.



\---



\## 🔄 CI/CD Pipeline



The Jenkins pipeline automates the application build and deployment workflow.



When code is pushed to the application repository, Jenkins:



1\. Checks out the source code.

2\. Builds container images for all four microservices using \*\*Kaniko\*\*.

3\. Tags images using the Jenkins build number.

4\. Pushes the images to Docker Hub.

5\. Runs \*\*Trivy\*\* scans for HIGH and CRITICAL vulnerabilities.

6\. Archives the generated vulnerability reports.

7\. Clones the separate `cloudcart-manifests` GitOps repository.

8\. Updates Kubernetes deployment image tags with the new build number.

9\. Commits and pushes the updated manifests.

10\. Argo CD detects the desired-state change and synchronizes it with the EKS cluster.



This separates application source code from Kubernetes deployment configuration and follows a GitOps-style deployment model.



\### Jenkins Pipeline



!\[Successful Jenkins Pipeline](docs/screenshots/jenkins-pipeline.png)



The pipeline successfully updates the image versions in the manifests repository after building and scanning the application containers.



\---



\## 🔐 Container Security Scanning



Container images are scanned with \*\*Trivy\*\* before the deployment configuration is updated.



The pipeline scans all four images for:



```text

HIGH

CRITICAL

```



severity vulnerabilities.



Reports are generated for:



```text

order-service

payment-service

product-service

user-service

```



and archived as Jenkins build artifacts.



This integrates container vulnerability scanning directly into the CI workflow.



\---



\## 🚀 GitOps with Argo CD



Application deployment is managed through \*\*Argo CD\*\*.



Instead of Jenkins directly modifying workloads in the Kubernetes cluster, Jenkins updates the separate manifests repository.



```text

Jenkins

&#x20;  │

&#x20;  ▼

cloudcart-manifests

&#x20;  │

&#x20;  ▼

Argo CD

&#x20;  │

&#x20;  ▼

Amazon EKS

```



Argo CD continuously compares the Git-defined desired state with the Kubernetes cluster state.



\### Argo CD Application



!\[Argo CD Application](docs/screenshots/argocd.png)



The CloudCart application is shown as:



```text

Healthy

Synced

```



demonstrating that the GitOps repository and EKS workloads are synchronized.



\---



\## ☸️ Kubernetes on Amazon EKS



The application runs on \*\*Amazon Elastic Kubernetes Service (EKS)\*\*.



\### EKS Cluster



!\[Amazon EKS Cluster](docs/screenshots/EKS-cluster.png)



Kubernetes manages the application services along with the supporting DevOps and observability workloads.



\### Running Kubernetes Workloads



!\[Kubernetes Pods](docs/screenshots/kubernetes-pods.png)



The cluster contains workloads across namespaces including:



```text

default

argocd

jenkins

monitoring

logging

ingress-nginx

kube-system

```



This includes the application microservices as well as Jenkins, Argo CD, ingress, monitoring, logging, and AWS/Kubernetes system components.



\---



\## 🌐 Kubernetes Networking



The microservices communicate internally using Kubernetes Services.



Product, Order, and Payment services use:



```text

ClusterIP

```



for internal cluster communication.



External traffic is routed into the cluster using the \*\*NGINX Ingress Controller\*\*.



This provides a centralized entry point rather than exposing every application service individually.



\---



\## 📊 Monitoring with Prometheus \& Grafana



The cluster uses \*\*Prometheus\*\* for metrics collection and \*\*Grafana\*\* for visualization.



Monitoring provides visibility into Kubernetes resource utilization including:



\- CPU usage

\- Memory usage

\- CPU requests and limits

\- Memory requests and limits

\- Namespace-level resource consumption

\- Kubernetes workloads



\### Grafana Kubernetes Dashboard



!\[Grafana Kubernetes Dashboard](docs/screenshots/grafana-dashboard.png)



The dashboard provides real-time visibility into resources running across namespaces such as Argo CD, Jenkins, monitoring, and application workloads.



\---



\## 📜 Centralized Logging with Loki \& Promtail



CloudCart implements centralized Kubernetes logging using:



```text

Application Pods

&#x20;      │

&#x20;      ▼

&#x20;   Promtail

&#x20;      │

&#x20;      ▼

&#x20;     Loki

&#x20;      │

&#x20;      ▼

&#x20;   Grafana

```



Promtail runs as a Kubernetes \*\*DaemonSet\*\* and discovers pod log files from the cluster.



It attaches Kubernetes metadata including:



```text

app

container

namespace

pod

node\_name

job

```



before forwarding logs to Loki.



Grafana uses Loki as a data source, allowing logs to be queried using LogQL.



Example:



```logql

{job="default/user-service"}

```



\### Application Logs in Grafana



!\[Loki Application Logs](docs/screenshots/loki-logs.png)



The screenshot demonstrates logs generated by the `user-service` being collected from Kubernetes and queried through Grafana.



\---



\## 📁 Repository Structure



```text

cloudcart-apps/

│

├── user-service/

│   ├── Dockerfile

│   ├── deployment.yaml

│   ├── service.yaml

│   ├── package.json

│   └── server.js

│

├── product-service/

│   ├── Dockerfile

│   ├── deployment.yaml

│   ├── service.yaml

│   ├── package.json

│   └── server.js

│

├── order-service/

│   ├── Dockerfile

│   ├── deployment.yaml

│   ├── service.yaml

│   ├── package.json

│   └── server.js

│

├── payment-service/

│   ├── Dockerfile

│   ├── deployment.yaml

│   ├── service.yaml

│   ├── package.json

│   └── server.js

│

├── docs/

│   └── screenshots/

│

├── Jenkinsfile

├── loki-values.yaml

├── .gitignore

└── README.md

```



The Kubernetes manifests used by the GitOps deployment workflow are maintained separately in the \*\*cloudcart-manifests\*\* repository.



\---



\## 🔁 End-to-End Deployment Flow



```text

1\. Developer pushes application changes

&#x20;                   ↓

2\. Jenkins detects/checks out the new code

&#x20;                   ↓

3\. Kaniko builds microservice container images

&#x20;                   ↓

4\. Images are pushed to Docker Hub

&#x20;                   ↓

5\. Trivy scans the container images

&#x20;                   ↓

6\. Jenkins updates image tags in cloudcart-manifests

&#x20;                   ↓

7\. Updated manifests are pushed to GitHub

&#x20;                   ↓

8\. Argo CD detects the Git change

&#x20;                   ↓

9\. Argo CD synchronizes the desired state

&#x20;                   ↓

10\. Kubernetes deploys the new containers on Amazon EKS

&#x20;                   ↓

11\. Prometheus collects cluster metrics

&#x20;                   ↓

12\. Promtail forwards application logs to Loki

&#x20;                   ↓

13\. Grafana provides metrics and centralized log visibility

```



\---



\## 💡 Key DevOps Concepts Demonstrated



This project demonstrates practical implementation of:



\- Containerization

\- Kubernetes orchestration

\- Managed Kubernetes with AWS EKS

\- Kubernetes Services and Ingress

\- CI/CD pipeline automation

\- Container builds using Kaniko

\- Container vulnerability scanning

\- GitOps-based continuous deployment

\- Kubernetes observability

\- Prometheus metrics collection

\- Grafana dashboards

\- Centralized Kubernetes logging

\- LogQL-based log querying

\- Helm-based application installation

\- Multi-repository CI/CD architecture



\---



\## 📌 Project Status



The CloudCart DevOps platform currently demonstrates an operational end-to-end pipeline:



```text

GitHub

&#x20;  ↓

Jenkins

&#x20;  ↓

Kaniko

&#x20;  ↓

Trivy

&#x20;  ↓

Docker Hub

&#x20;  ↓

GitOps Repository

&#x20;  ↓

Argo CD

&#x20;  ↓

Amazon EKS

&#x20;  ↓

Prometheus / Grafana / Loki

```



Application workloads are deployed on EKS, Argo CD manages synchronization, Jenkins automates image builds and manifest updates, Trivy provides container scanning, Prometheus collects Kubernetes metrics, and Loki provides centralized application logging.



\---



\## 👤 Author



\*\*Somil Mor\*\*



DevOps / Cloud Enthusiast



Technologies: AWS • Docker • Kubernetes • Jenkins • Argo CD • Terraform • Prometheus • Grafana • Linux • Git


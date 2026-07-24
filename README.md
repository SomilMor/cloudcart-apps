\# CloudCart — Production-Style DevOps Platform on AWS EKS



CloudCart is a cloud-native microservices project built to demonstrate an end-to-end DevOps workflow on AWS.



The project deploys four containerized Node.js microservices to an Amazon EKS Kubernetes cluster and implements automated CI/CD, GitOps deployment, container security scanning, monitoring, and centralized logging.



The primary focus of this project is the \*\*DevOps architecture and deployment lifecycle\*\* rather than application complexity.



\---



\## Architecture Overview



```text

Developer

&#x20;   |

&#x20;   v

GitHub - cloudcart-apps

&#x20;   |

&#x20;   v

Jenkins CI Pipeline

&#x20;   |

&#x20;   +---- Build container images with Kaniko

&#x20;   |

&#x20;   +---- Push images to Docker Hub

&#x20;   |

&#x20;   +---- Scan images with Trivy

&#x20;   |

&#x20;   v

GitHub - cloudcart-manifests

&#x20;   |

&#x20;   v

Argo CD

&#x20;   |

&#x20;   v

Amazon EKS

&#x20;   |

&#x20;   +---- NGINX Ingress

&#x20;   |

&#x20;   +---- User Service

&#x20;   +---- Product Service

&#x20;   +---- Order Service

&#x20;   +---- Payment Service





Observability



Prometheus ----> Grafana



Application Pods ----> Promtail ----> Loki ----> Grafana

```



\---



\## Tech Stack



| Category | Technology |

| --- | --- |

| Cloud Platform | AWS |

| Container Orchestration | Kubernetes, Amazon EKS |

| Containers | Docker |

| Container Builds | Kaniko |

| CI | Jenkins |

| GitOps / CD | Argo CD |

| Security Scanning | Trivy |

| Ingress | NGINX Ingress Controller |

| Monitoring | Prometheus |

| Visualization | Grafana |

| Logging | Loki, Promtail |

| Package Management | Helm |

| Version Control | Git, GitHub |

| Application | Node.js, Express |



\---



\## Microservices



CloudCart consists of four lightweight Node.js and Express microservices.



| Service | Purpose | Port |

| --- | --- | ---: |

| User Service | User-facing service and health endpoint | 3000 |

| Product Service | Product API | 3000 |

| Order Service | Order API | 3000 |

| Payment Service | Mock payment API | 3000 |



Each service is independently containerized using its own Dockerfile and deployed as a Kubernetes workload.



The services are intentionally simple because the project focuses on the infrastructure, CI/CD, GitOps, security, and observability surrounding the applications.



\---



\## CI/CD Pipeline with Jenkins



The Jenkins pipeline automates the container build and deployment workflow.



The pipeline performs the following operations:



1\. Checks out the application source code.

2\. Builds images for all four microservices using Kaniko.

3\. Tags each image using the Jenkins build number.

4\. Pushes the container images to Docker Hub.

5\. Scans the images using Trivy.

6\. Generates and archives vulnerability reports.

7\. Clones the separate `cloudcart-manifests` repository.

8\. Updates the Kubernetes deployment image tags.

9\. Commits the new image versions to Git.

10\. Pushes the updated manifests to GitHub.

11\. Argo CD detects the desired-state change and synchronizes the EKS cluster.



This creates a separation between the \*\*CI process\*\* and the \*\*deployment process\*\*.



Jenkins produces and validates the application artifacts, while Argo CD is responsible for maintaining the desired state of the Kubernetes cluster.



\### Successful Jenkins Pipeline



!\[Successful Jenkins Pipeline](docs/screenshots/jenkins-pipeline.png)



The screenshot above shows a successful Jenkins build updating all four image tags in the manifests repository and pushing the changes to GitHub.



\---



\## Container Builds with Kaniko



The Jenkins agents run inside Kubernetes.



Instead of requiring a Docker daemon inside the Jenkins build environment, container images are built using \*\*Kaniko\*\*.



Each microservice has its own build context and Dockerfile.



The generated images follow the pattern:



```text

somil7/user-service:<BUILD\_NUMBER>

somil7/product-service:<BUILD\_NUMBER>

somil7/order-service:<BUILD\_NUMBER>

somil7/payment-service:<BUILD\_NUMBER>

```



Using the Jenkins build number provides a unique image version for each pipeline execution.



\---



\## Container Security with Trivy



Container images are scanned using \*\*Trivy\*\* as part of the Jenkins pipeline.



The pipeline checks each microservice image for:



\- HIGH severity vulnerabilities

\- CRITICAL severity vulnerabilities



Reports are generated for:



\- `user-service`

\- `product-service`

\- `order-service`

\- `payment-service`



The reports are stored as Jenkins build artifacts.



This integrates container vulnerability scanning directly into the CI workflow rather than treating security as a separate manual step.



\---



\## GitOps with Argo CD



Application deployment is managed through \*\*Argo CD\*\*.



Jenkins does not directly deploy the new application version to the Kubernetes cluster.



Instead, the deployment flow is:



\*\*Jenkins → cloudcart-manifests → Argo CD → Amazon EKS\*\*



Jenkins updates the desired image versions inside the separate `cloudcart-manifests` Git repository.



Argo CD monitors that repository and compares the Git-defined desired state against the actual state of the Kubernetes cluster.



When a change is detected, Argo CD synchronizes the Kubernetes resources.



\### Argo CD Application



!\[Argo CD Application](docs/screenshots/argocd.png)



The CloudCart application is shown as:



\- \*\*Healthy\*\*

\- \*\*Synced\*\*



This demonstrates that the resources running in EKS match the desired state stored in Git.



\---



\## Amazon EKS



CloudCart runs on \*\*Amazon Elastic Kubernetes Service (EKS)\*\*.



EKS provides the managed Kubernetes control plane while Kubernetes handles deployment, scheduling, service discovery, networking, and workload management.



\### EKS Cluster



!\[Amazon EKS Cluster](docs/screenshots/EKS-cluster.png)



The project uses multiple Kubernetes namespaces to separate application and platform components.



Examples include:



\- `default`

\- `argocd`

\- `jenkins`

\- `monitoring`

\- `logging`

\- `ingress-nginx`

\- `kube-system`



\### Kubernetes Workloads



!\[Kubernetes Pods](docs/screenshots/kubernetes-pods.png)



The cluster runs the four CloudCart microservices alongside the supporting CI/CD, GitOps, ingress, monitoring, logging, and Kubernetes system workloads.



\---



\## Kubernetes Networking



The microservices communicate using Kubernetes Services.



The application services use internal `ClusterIP` networking.



External traffic enters the cluster through the \*\*NGINX Ingress Controller\*\*.



The networking model is therefore:



\*\*Client → AWS Load Balancer → NGINX Ingress → Kubernetes Service → Application Pod\*\*



This avoids creating a separate external load balancer for every microservice and provides a centralized ingress layer for application traffic.



\---



\## Monitoring with Prometheus and Grafana



CloudCart includes cluster monitoring using \*\*Prometheus and Grafana\*\*.



Prometheus collects metrics from the Kubernetes environment, while Grafana provides dashboards for visualization.



The monitoring stack provides visibility into information such as:



\- CPU utilization

\- Memory utilization

\- CPU requests

\- CPU limits

\- Memory requests

\- Memory limits

\- Namespace resource consumption

\- Kubernetes workloads



\### Grafana Kubernetes Dashboard



!\[Grafana Kubernetes Dashboard](docs/screenshots/grafana-dashboard.png)



The dashboard provides visibility into resource consumption across namespaces such as Argo CD, Jenkins, monitoring, Kubernetes system workloads, and the application environment.



\---



\## Centralized Logging with Loki and Promtail



CloudCart also implements centralized Kubernetes logging.



The logging pipeline is:



\*\*Application Pods → Promtail → Loki → Grafana\*\*



Promtail runs as a Kubernetes \*\*DaemonSet\*\*, allowing it to collect logs from pods running across the worker nodes.



Promtail discovers Kubernetes pod log files and attaches metadata before forwarding them to Loki.



Useful labels include:



\- `app`

\- `container`

\- `namespace`

\- `pod`

\- `node\_name`

\- `job`



Loki stores and indexes the log streams while Grafana provides an interface for searching and analyzing them.



\### LogQL Example



Application logs can be queried using LogQL.



For example:



```logql

{job="default/user-service"}

```



\### Application Logs in Grafana



!\[Loki Application Logs](docs/screenshots/loki-logs.png)



The screenshot demonstrates logs generated by the `user-service` being collected from Kubernetes and queried through Grafana.



This provides centralized visibility without requiring direct access to individual application pods.



\---



\## Repository Structure



```text

cloudcart-apps/

|

|-- user-service/

|   |-- Dockerfile

|   |-- deployment.yaml

|   |-- service.yaml

|   |-- package.json

|   `-- server.js

|

|-- product-service/

|   |-- Dockerfile

|   |-- deployment.yaml

|   |-- service.yaml

|   |-- package.json

|   `-- server.js

|

|-- order-service/

|   |-- Dockerfile

|   |-- deployment.yaml

|   |-- service.yaml

|   |-- package.json

|   `-- server.js

|

|-- payment-service/

|   |-- Dockerfile

|   |-- deployment.yaml

|   |-- service.yaml

|   |-- package.json

|   `-- server.js

|

|-- docs/

|   `-- screenshots/

|       |-- EKS-cluster.png

|       |-- argocd.png

|       |-- grafana-dashboard.png

|       |-- jenkins-pipeline.png

|       |-- kubernetes-pods.png

|       `-- loki-logs.png

|

|-- Jenkinsfile

|-- loki-values.yaml

|-- .gitignore

`-- README.md

```



The Kubernetes manifests used by the GitOps deployment workflow are maintained separately in the `cloudcart-manifests` repository.



\---



\## End-to-End Deployment Flow



The complete deployment lifecycle works as follows:



1\. A developer pushes application changes to GitHub.

2\. Jenkins checks out the latest source code.

3\. Kaniko builds container images for the four microservices.

4\. The images are pushed to Docker Hub with the Jenkins build number as the image tag.

5\. Trivy scans the container images for HIGH and CRITICAL vulnerabilities.

6\. Jenkins clones the `cloudcart-manifests` repository.

7\. Jenkins updates the Kubernetes deployment manifests with the new image versions.

8\. The updated manifests are committed and pushed to GitHub.

9\. Argo CD detects the Git repository change.

10\. Argo CD synchronizes the desired state with Amazon EKS.

11\. Kubernetes rolls out the updated application containers.

12\. NGINX Ingress routes incoming application traffic.

13\. Prometheus collects Kubernetes metrics.

14\. Promtail collects pod logs and forwards them to Loki.

15\. Grafana provides dashboards for metrics and centralized log exploration.



\---



\## CI and GitOps Separation



An important architectural decision in this project is separating continuous integration from continuous deployment.



\### Continuous Integration



Jenkins handles:



\- Source checkout

\- Container image builds

\- Image versioning

\- Docker Hub pushes

\- Trivy security scanning

\- Security report archiving

\- GitOps manifest updates



\### Continuous Deployment



Argo CD handles:



\- Watching the manifests repository

\- Detecting desired-state changes

\- Synchronizing Kubernetes resources

\- Maintaining the Git-defined cluster state



This means Jenkins does not require direct application deployment logic such as repeated `kubectl apply` commands.



Git acts as the source of truth for application deployment state.



\---



\## Observability Architecture



CloudCart uses separate pipelines for metrics and logs.



\### Metrics



\*\*Kubernetes → Prometheus → Grafana\*\*



Prometheus collects metrics from the Kubernetes environment and Grafana provides dashboards for visualization.



\### Logs



\*\*Kubernetes Pods → Promtail → Loki → Grafana\*\*



Promtail collects container logs, Loki stores the log streams, and Grafana provides LogQL-based exploration.



Together, these provide visibility into both infrastructure behavior and application activity.



\---



\## Key DevOps Concepts Demonstrated



This project demonstrates practical experience with:



\- AWS cloud infrastructure

\- Amazon EKS

\- Kubernetes deployments and services

\- Kubernetes namespaces

\- Kubernetes ingress

\- Docker containerization

\- Kaniko container builds

\- Jenkins pipelines

\- CI/CD automation

\- GitOps

\- Argo CD

\- Container vulnerability scanning

\- Trivy

\- Prometheus monitoring

\- Grafana dashboards

\- Loki centralized logging

\- Promtail DaemonSets

\- Helm deployments

\- Git-based infrastructure workflows

\- Multi-repository CI/CD architecture



\---



\## Project Status



The complete DevOps workflow is operational:



\*\*GitHub → Jenkins → Kaniko → Trivy → Docker Hub → GitOps Repository → Argo CD → Amazon EKS\*\*



Observability is provided through:



\*\*Prometheus → Grafana\*\*



and:



\*\*Promtail → Loki → Grafana\*\*



The project currently demonstrates:



\- Four containerized microservices

\- Kubernetes deployment on AWS EKS

\- Automated Jenkins CI

\- Kaniko-based image builds

\- Automated image versioning

\- Container security scanning

\- Separate GitOps manifests repository

\- Argo CD continuous deployment

\- NGINX ingress

\- Prometheus monitoring

\- Grafana dashboards

\- Loki centralized logging

\- Promtail Kubernetes log collection



\---



\## Author



\*\*Somil Mor\*\*



B.Tech Electronics and Communication Engineering  

DevOps and Cloud Enthusiast



\*\*Core Technologies:\*\* AWS, Linux, Docker, Kubernetes, Jenkins, Argo CD, Git, GitHub, Prometheus, Grafana, Loki and Terraform


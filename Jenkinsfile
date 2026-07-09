pipeline {
    agent {
        kubernetes {
            label 'kaniko'
        }
    }

    environment {
        DOCKERHUB_USERNAME = "somil7"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Order Service') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                        mkdir -p /tmp/docker

                        cat > /tmp/docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "${DOCKER_USER}",
      "password": "${DOCKER_PASS}"
    }
  }
}
EOF

                        export DOCKER_CONFIG=/tmp/docker

                        /kaniko/executor \
                          --context=$WORKSPACE/order-service \
                          --dockerfile=$WORKSPACE/order-service/Dockerfile \
                          --destination=somil7/order-service:latest \
                          --verbosity=debug
                        '''
                    }
                }
            }
        }

        stage('Build & Push Payment Service') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                        mkdir -p /tmp/docker

                        cat > /tmp/docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "${DOCKER_USER}",
      "password": "${DOCKER_PASS}"
    }
  }
}
EOF

                        export DOCKER_CONFIG=/tmp/docker

                        /kaniko/executor \
                          --context=$WORKSPACE/payment-service \
                          --dockerfile=$WORKSPACE/payment-service/Dockerfile \
                          --destination=somil7/payment-service:latest \
                          --verbosity=debug
                        '''
                    }
                }
            }
        }

        stage('Build & Push Product Service') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                        mkdir -p /tmp/docker

                        cat > /tmp/docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "${DOCKER_USER}",
      "password": "${DOCKER_PASS}"
    }
  }
}
EOF

                        export DOCKER_CONFIG=/tmp/docker

                        /kaniko/executor \
                          --context=$WORKSPACE/product-service \
                          --dockerfile=$WORKSPACE/product-service/Dockerfile \
                          --destination=somil7/product-service:latest \
                          --verbosity=debug
                        '''
                    }
                }
            }
        }

        stage('Build & Push User Service') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                        mkdir -p /tmp/docker

                        cat > /tmp/docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "${DOCKER_USER}",
      "password": "${DOCKER_PASS}"
    }
  }
}
EOF

                        export DOCKER_CONFIG=/tmp/docker

                        /kaniko/executor \
                          --context=$WORKSPACE/user-service \
                          --dockerfile=$WORKSPACE/user-service/Dockerfile \
                          --destination=somil7/user-service:latest \
                          --verbosity=debug
                        '''
                    }
                }
            }
        }
    }
}
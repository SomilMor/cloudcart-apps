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
                        cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "$DOCKER_USER",
      "password": "$DOCKER_PASS"
    }
  }
}
EOF

                        /kaniko/executor \
                        --context=$WORKSPACE/order-service \
                        --dockerfile=$WORKSPACE/order-service/Dockerfile \
                        --destination=$DOCKERHUB_USERNAME/order-service:latest
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
                        cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "$DOCKER_USER",
      "password": "$DOCKER_PASS"
    }
  }
}
EOF

                        /kaniko/executor \
                        --context=$WORKSPACE/payment-service \
                        --dockerfile=$WORKSPACE/payment-service/Dockerfile \
                        --destination=$DOCKERHUB_USERNAME/payment-service:latest
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
                        cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "$DOCKER_USER",
      "password": "$DOCKER_PASS"
    }
  }
}
EOF

                        /kaniko/executor \
                        --context=$WORKSPACE/product-service \
                        --dockerfile=$WORKSPACE/product-service/Dockerfile \
                        --destination=$DOCKERHUB_USERNAME/product-service:latest
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
                        cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "$DOCKER_USER",
      "password": "$DOCKER_PASS"
    }
  }
}
EOF

                        /kaniko/executor \
                        --context=$WORKSPACE/user-service \
                        --dockerfile=$WORKSPACE/user-service/Dockerfile \
                        --destination=$DOCKERHUB_USERNAME/user-service:latest
                        '''
                    }
                }
            }
        }
    }
}
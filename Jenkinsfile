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

        stage('Debug Workspace') {
            steps {
                container('kaniko') {
                    sh '''
                    echo "===== PWD ====="
                    pwd

                    echo "===== WORKSPACE ====="
                    echo $WORKSPACE

                    echo "===== ROOT ====="
                    ls -la $WORKSPACE

                    echo "===== ORDER SERVICE ====="
                    ls -la $WORKSPACE/order-service

                    echo "===== PACKAGE.JSON ====="
                    cat $WORKSPACE/order-service/package.json

                    echo "===== DOCKERFILE ====="
                    cat $WORKSPACE/order-service/Dockerfile
                    '''
                }
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
                        mkdir -p /kaniko/.docker

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

                        echo "===== DOCKER CONFIG ====="
                        cat /kaniko/.docker/config.json

                        /kaniko/executor \
                          --verbosity=debug \
                          --snapshot-mode=redo \
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
                echo "Skipping for now"
            }
        }

        stage('Build & Push Product Service') {
            steps {
                echo "Skipping for now"
            }
        }

        stage('Build & Push User Service') {
            steps {
                echo "Skipping for now"
            }
        }
    }
}
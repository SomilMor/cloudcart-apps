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
                        --destination=$DOCKERHUB_USERNAME/order-service:${BUILD_NUMBER}
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

echo "===== PAYMENT CONTEXT ====="
pwd
ls -la
ls -la $WORKSPACE/payment-service
cat $WORKSPACE/payment-service/package.json

echo "===== BUILDING IMAGE ====="

/kaniko/executor \
--verbosity=debug \
--context=$WORKSPACE/payment-service \
--dockerfile=$WORKSPACE/payment-service/Dockerfile \
--destination=$DOCKERHUB_USERNAME/payment-service:${BUILD_NUMBER}
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
                        --destination=$DOCKERHUB_USERNAME/product-service:${BUILD_NUMBER}
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
                        --destination=$DOCKERHUB_USERNAME/user-service:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }
    
    stage('Update Manifests') {
    steps {
        container('jnlp') {
            withCredentials([usernamePassword(
                credentialsId: 'github',
                usernameVariable: 'GIT_USER',
                passwordVariable: 'GIT_TOKEN'
            )]) {

                sh '''
                rm -rf manifests

                git clone https://$GIT_USER:$GIT_TOKEN@github.com/SomilMor/cloudcart-manifests.git manifests

                cd manifests

                sed -i "s|image: somil7/order-service:.*|image: somil7/order-service:${BUILD_NUMBER}|g" k8s/order/deployment.yaml

                sed -i "s|image: somil7/payment-service:.*|image: somil7/payment-service:${BUILD_NUMBER}|g" k8s/payment/deployment.yaml

                sed -i "s|image: somil7/product-service:.*|image: somil7/product-service:${BUILD_NUMBER}|g" k8s/product/deployment.yaml

                sed -i "s|image: somil7/user-service:.*|image: somil7/user-service:${BUILD_NUMBER}|g" k8s/user/deployment.yaml

                echo "===== UPDATED FILES ====="

git config user.email "jenkins@cloudcart.local"
git config user.name "Jenkins"

git add .

git commit -m "Update images to build ${BUILD_NUMBER}" || echo "Nothing to commit"

git push origin main
                '''
            }
        }
    }
}
}
}
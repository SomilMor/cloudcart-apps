pipeline {
    agent {
        kubernetes {
            label 'kaniko'
        }
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Payment Debug') {
            steps {
                container('kaniko') {
                    sh '''
                    echo "===== GIT COMMIT ====="
                    git rev-parse HEAD

                    echo "===== WORKSPACE ====="
                    pwd

                    echo "===== PAYMENT FILES ====="
                    ls -la $WORKSPACE/payment-service

                    echo "===== DOCKERFILE ====="
                    cat $WORKSPACE/payment-service/Dockerfile

                    echo "===== PACKAGE.JSON ====="
                    cat $WORKSPACE/payment-service/package.json

                    echo "===== DOCKERIGNORE ====="
                    if [ -f $WORKSPACE/payment-service/.dockerignore ]; then
                      cat $WORKSPACE/payment-service/.dockerignore
                    else
                      echo "NO .dockerignore"
                    fi

                    echo "===== NODE_MODULES ====="
                    find $WORKSPACE/payment-service/node_modules | head -20
                    '''
                }
            }
        }
    }
}
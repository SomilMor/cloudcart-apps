pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Order Service') {
            steps {
                dir('order-service') {
                    sh 'docker build -t somil7/order-service:latest .'
                }
            }
        }

        stage('Build Payment Service') {
            steps {
                dir('payment-service') {
                    sh 'docker build -t somil7/payment-service:latest .'
                }
            }
        }

        stage('Build Product Service') {
            steps {
                dir('product-service') {
                    sh 'docker build -t somil7/product-service:latest .'
                }
            }
        }

        stage('Build User Service') {
            steps {
                dir('user-service') {
                    sh 'docker build -t somil7/user-service:latest .'
                }
            }
        }
    }
}
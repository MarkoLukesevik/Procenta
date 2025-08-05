pipeline {

    agent {
        label 'docker-agent'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    docker.build("registry.nerathos.xyz/procenta-client:latest").push()
                }
            }
        }
    }

}


pipeline {

    agent {
        label 'docker-agent'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    def sha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    docker.build("registry.nerathos.xyz/procenta-client:${sha}").push()
                }
            }
        }
    }

}


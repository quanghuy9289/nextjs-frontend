pipeline {
   agent {
        docker {
            image 'node:14.8'
            args '-u 0:0'
            args '-v $HOME/.docker:/root/.docker'
        }
   }
   environment {
       registry = "quanghuy9289/nextjs-frontend"
   }
   stages {
       stage('Build') {
           steps {
               sh "npm install -g yarn --force"
               // Build the app.
               sh 'yarn install'
           }
       }
       stage('Test') {
           steps {
               // Run Unit Tests.
               sh 'echo "TODO: Running Test..."'
           }
       }
       stage('Publish') {
           environment {
               registryCredential = 'dockerhub'
           }
           steps{
               script {
                   def appimage = docker.build registry + ":$BUILD_NUMBER"
                   docker.withRegistry( '', registryCredential ) {
                       appimage.push()
                       appimage.push('latest')
                   }
               }
           }
       }
       stage ('Deploy') {
           steps {
               script{
                   def image_id = registry + ":$BUILD_NUMBER"
                   sh "ansible-playbook  playbook.yml --extra-vars \"image_id=${image_id}\""
               }
           }
       }
   }
}

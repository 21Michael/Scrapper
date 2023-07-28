# 1) Start minikube (local kubernetes cluster)
#minikube start
#minikube ip
#minikube dashboard
#minikube stop

# 2) Get commands:
#kubectl get deployments
#kubectl get services
#kubectl get storageclass
kubectl get pods
#kubectl get pv

# 3) Apply commands:
#kubectl apply -f deployments
#kubectl apply -f services
#kubectl apply -f persistentVolumeClaim

# 4) Delete commands:
#kubectl delete deployment scrapper-deployment
#kubectl delete deployment api-deployment

#kubectl delete deployment --all
#kubectl delete services --all
#kubectl delete pods --all

# 5) Logs commands:
#kubectl logs api-deployment-b8659987f-svlc6

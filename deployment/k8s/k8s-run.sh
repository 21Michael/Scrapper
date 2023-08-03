# 1) Start minikube (local kubernetes cluster)
#minikube start
#minikube ip
#minikube dashboard
#minikube stop

# 2) Get commands:
#kubectl get deployments
#kubectl get services
#kubectl get storageclass
#kubectl get pods
#kubectl get pv
#kubectl get namespaces

# 3) Apply commands:
#kubectl apply -f deployments
#kubectl apply -f services
#kubectl apply -f persistentVolumeClaim

# 4) Delete commands:
#kubectl delete deployment scrapper-deployment
#kubectl delete deployment api-deployment
#
#kubectl delete deployment --all
#kubectl delete services --all
#kubectl delete pods --all

# 5) Logs commands:
#kubectl logs scrapper-deployment-fb9b5bcb8-7nmx2
#kubectl logs scrapper-worker-deployment-5cd95cb6c8-5r584
#kubectl logs scrapper-worker-deployment-5cd95cb6c8-8hxsm
#kubectl logs scrapper-worker-deployment-5cd95cb6c8-dnqrp

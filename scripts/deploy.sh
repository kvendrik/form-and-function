echo '>> Copying'
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ./ root@37.128.149.176:/var/www/html/form-and-function/ --exclude '.git' --exclude 'node_modules'

#echo '>> Installing Dependencies & Starting Server...'
#ssh root@37.128.149.176 'cd /var/www/html/form-and-function && sh scripts/setup.sh && sh scripts/start-server.sh'

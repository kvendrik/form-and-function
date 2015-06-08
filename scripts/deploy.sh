printf '\n>> Copying\n'
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ./ root@37.128.149.176:/var/www/html/form-and-function/ --exclude '.git' --exclude 'node_modules'

if [ "$1" == "--start" ]; then
    ssh root@37.128.149.176 'cd /var/www/html/form-and-function && sh scripts/setup.sh && sh scripts/start-server.sh'
fi

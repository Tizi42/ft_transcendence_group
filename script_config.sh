ip=$(ip -o -4 addr list enp3s0f0 | awk '{print $4}' | cut -d/ -f1)
echo "$ip"
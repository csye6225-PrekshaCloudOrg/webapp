#!/bin/bash

curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -
sudo yum install -y nodejs

node --version

# Step 2: Install PostgreSQL on CentOS 8
sudo dnf module list postgresql
sudo dnf module enable postgresql:12
sudo dnf install -y postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Step 3: Set password for the postgres user in PostgreSQL
sudo -i -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Step 4: Update pg_hba.conf file
sudo sed -i 's/^\(host.*all.*all.*\)\(ident\)\(.*\)$/\1md5\3/g' /var/lib/pgsql/data/pg_hba.conf

# Step 5: Restart PostgreSQL
sudo systemctl restart postgresql

# Step 6: Create a database
sudo -u postgres psql -c "CREATE DATABASE test01;"

# Step 7: Install unzip
sudo yum makecache
sudo yum install -y unzip

echo "Initialization completed."

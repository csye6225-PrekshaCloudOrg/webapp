packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}


source "googlecompute" "centos8" {
  project_id              = "dev-gcp-414600"
  zone                    = "us-central1-a"
  source_image_family     = "centos-stream-8"
  source_image_project_id = ["centos-cloud"]
  ssh_username            = "packer"
  machine_type            = "e2-medium"
  disk_size               = 100
  image_name              = "centos-8-packer-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  disk_type               = "pd-standard"
}

build {
  sources = ["source.googlecompute.centos8"]

  # provisioner "shell" {
  #   inline = [
  #     "sudo yum update -y"
  #   ]
  # }
  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    inline = [
      "sudo cp /tmp/webapp.service /etc/systemd/system/webapp.service"
    ]
  }
  provisioner "file" {
    source      = "userCreation.sh"
    destination = "/tmp/userCreation.sh"
  }
  provisioner "shell" {
    inline = [
      "sudo chmod +x /tmp/userCreation.sh",
      "sudo /tmp/userCreation.sh"
    ]
  }
  provisioner "file" {
    source      = "startUp.sh"
    destination = "/tmp/startUp.sh"
  }
  provisioner "shell" {
    inline = [
      "sudo chmod +x /tmp/startUp.sh",
      "sudo /tmp/startUp.sh"
    ]
  }

  provisioner "file" {
    source      = "webapp-fork-main.zip"
    destination = "/tmp/webapp-fork-main.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo yum install -y unzip",
      "unzip /tmp/webapp-fork-main.zip -d /tmp/webapp",
      "sudo chown -R csye6225:csye6225 tmp/webapp"
    ]
  }

  provisioner "file" {
    source      = ".env"
    destination = "/tmp/webapp/.env"
  }
  provisioner "shell" {
    inline = [
      "cd /tmp/webapp && npm i"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service",
      "sudo systemctl start webapp.service"
    ]
  }

}

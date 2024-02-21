packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}


################################ Defining variables ################################
variable "project_id" {
  type    = string
  description = "The Google Cloud project ID"
  #default = "dev-gcp-414600"
}

variable "zone" {
  type    = string
  description = "The zone in which the instance will be created"
  default = "us-central1-a"
}

variable "source_image_family" {
  type    = string
  description = "The family name of the source image"
  default = "centos-stream-8"
}

variable "source_image_project_id" {
  type    = list(string)
  description = "The project ID of the source image"
  default = ["centos-cloud"]
}

variable "ssh_username" {
  type    = string
  description = "The SSH username"
  default = "packer"
}

variable "machine_type" {
  type    = string
  description = "The machine type of the instance"
  default = "e2-medium"
}

variable "disk_size" {
  type    = number
  description = "The size of the disk in GB"
  default = 100
}

variable "disk_type" {
  type    = string
  description = "The type of disk"
  default = "pd-standard"
}


################################ Configurations ################################

source "googlecompute" "centos8" {
  project_id              = var.project_id
  zone                    = var.zone
  source_image_family     = var.source_image_family
  source_image_project_id = var.source_image_project_id
  ssh_username            = var.ssh_username
  machine_type            = var.machine_type
  disk_size               = var.disk_size
  image_name              = "centos-8-packer-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  disk_type               = var.disk_type
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
      "unzip /tmp/webapp-fork-main.zip -d /tmp/webapp"
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
      "sudo chown -R csye6225:csye6225 /tmp/webapp"
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

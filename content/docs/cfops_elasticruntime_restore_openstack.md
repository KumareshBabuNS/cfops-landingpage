+++
title = "Elastic Runtime restore on OpenStack"
description = "CFOps on OpenStack"
date = "2016-07-13"
+++

# CFOPS on OpenStack
CFOps is an automation tool to backup and restore Pivotal Cloud Foundry (PCF). Currently CFOPS supports PCF 1.4 and above.
This guide describes step by step directions on running cfops Restore tool on OpenStack.

## Getting started
CFOps can be installed on your Ops Manager host or a jump host that has access to Ops Manager and PCF deployments.

### Download the CFOPS binary

Get the latest release for your OS from the <a class="page-scroll" href="./downloads/release">Downloads</a> page.

### Restore Elastic Runtime on OpenStack
OpenStack requires the pem files as authentication mechanisms for ssh into virtual machines. The `cfops` tool will extract the pem file from Ops manager when doing restores for CF virtual machines.

Execute `cfops restore` command with the help option

```bash
ubuntu@ops-manager-1:~$ cfops restore --help
NAME:
   cfops restore - restores from an archive to the target tile
USAGE:
   cfops restore [command options] [arguments...]
DESCRIPTION:
   restore --opsmanagerhost <host> --adminuser <usr> --adminpass <pass> --opsmanageruser <opsuser> --opsmanagerpass <opspass> -d <dir> --tile elastic-runtime
OPTIONS:
   --opsmanagerpass value, --omp value		password for Ops Manager VM Access (used for ssh connections) [$CFOPS_OM_PASS]
   --opsmanagerpassphrase value, --omr value	passphrase is used by Ops Manager 1.7 to decrypt the installation files during restore [$CFOPS_OM_PASSPHRASE]
   --tile value, -t value			a tile you would like to run the operation on [$CFOPS_TILE]
   --opsmanagerhost value, --omh value		hostname for Ops Manager [$CFOPS_HOST]
   --opsmanageruser value, --omu value		username for Ops Manager VM Access (used for ssh connections) [$CFOPS_OM_USER]
   --destination value, -d value		path of the Cloud Foundry archive [$CFOPS_DEST_PATH]
   --encryptionkey value, -k value		encryption key to encrypt/decrypt your archive (key lengths supported are 16, 24, 32 for AES-128, AES-192, or AES-256) [$CFOPS_ENCRYPTION_KEY]
   --clear-bosh-manifest value			set this flag to clear the bosh-deployments.yml (this should only affect a restore of Ops-Manager) [$CFOPS_CLEAR_BOSH_MANIFEST]
   --pluginargs value, -p value			Arguments for plugin to execute [$CFOPS_PLUGIN_ARGS]
   --adminuser value, --du value		username for Ops Mgr admin (Ops Manager WebConsole Credentials) [$CFOPS_ADMIN_USER]
   --adminpass value, --dp value		password for Ops Mgr admin (Ops Manager WebConsole Credentials) [$CFOPS_ADMIN_PASS]
```
Restore Elastic Runtime using <code>cfops Restore</code>

```bash
ubuntu@ops-manager-1:~$ cfops Restore --opsmanageruser <opsusr> --opsmanagerpass <opspass> --opsmanagerhost <host> --adminuser <usr> --adminpass <pass> --opsmanagerpassphrase <passphrase> --destination <path> --tile elastic-runtime
```

__Note:__  cfops Restore command can be run in debug mode by setting LOG_LEVEL=debug

```bash
ubuntu@ops-manager-1:~$ LOG_LEVEL=debug cfops Restore --opsmanageruser USERNAME --opsmanagerpass Password --opsmanagerhost HostName --adminuser USERNAME --adminpass Password --opsmanagerpassphrase Password --destination <path> --tile elastic-runtime
```

### Using S3

You can use an s3 compatible blobstore for restores if you prefer. You must set the following environment variables:
```bash
export S3_ACCESS_KEY_ID="AKY83B2PMWVVY6EF89"
export S3_SECRET_ACCESS_KEY="PO+DKjfdakDKFDJ/gVDJDIEDKJFE3ZHdL"
export S3_BUCKET_NAME=pcfbackup
export S3_ACTIVE=true
export S3_DOMAIN=<some_compatible_s3_store_url>
```
where `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are your own AWS credentials and `S3_BUCKET_NAME` is the name of the bucket where the backup files are stored. `S3_DOMAIN` is optional
To disable S3 Restores, all you need to do is set `S3_ACTIVE=false`

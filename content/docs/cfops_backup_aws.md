+++
title = "AWS"
description = "CFOps on AWS"
date = "2016-01-19"
slug = "AWS"
+++

# CFOPS on AWS
CFOPS is automation tool to backup and restore Pivotal Cloud Foundry(PCF). Currently CFOPS supports PCF 1.6.
This Guide will describe step by step directions on running cfops backup tool on AWS

# Step 1 : Download the CFOPS tool from github

1. Sign into github.com using your github credentials

2. Access cfops latest release using following link : https://github.com/pivotalservices/cfops/releases/latest
3. Download and save the cfops binaries - <code>cfops_binaries.tgz</code>

# Step 2 : Backup Ops Manager on AWS


CFOps must be installed on your ops manager host as Ops manager host has access to Pivotal Cloud Foundry deployments which includes the elastic runtimes and BOSH.

1. Upload <code>cfops_binaries.tgz</code> to Ops manager host.
2. Uncompress <code>cfops_binaries.tgz</code> into a directory and extract the binary content.<pre class='terminal'>
$ uncompress cfops_binaries.tgz
$tar xvf cfops_binaries.tar
pipeline/output/builds/
pipeline/output/builds/osx/
pipeline/output/builds/osx/cfops
pipeline/output/builds/win64/
pipeline/output/builds/win64/cfops.exe
pipeline/output/builds/linux64/
pipeline/output/builds/linux64/cfops
</pre>

3. Traverse to <code>pipeline/output/builds/</code> directory to find your operating system specific directory : For example : linux64 or win64 for cfops linux executable or cfops.exe for win64.
4. Execute cfops command for verbose help option <pre class='terminal'>
    $ ubuntu@ip-10-0-0-154:~/cfops/pipeline/output/builds/linux64$ ./cfops backup --help
NAME:
   cfops backup - creates a backup archive of the target tile
USAGE:
   cfops backup [command options] [arguments...]
DESCRIPTION:
   backup --opsmanagerhost <host> --adminuser <usr> --adminpass <pass> --opsmanageruser <opsuser> --opsmanagerpass <opspass> -d <dir> --tile elastic-runtime
OPTIONS:
   --tile, -t 			a tile you would like to run the operation on [$CFOPS_TILE]
   --opsmanagerhost, --omh 	hostname for Ops Manager [$CFOPS_HOST]
   --adminuser, --du 		username for Ops Mgr admin (Ops Manager WebConsole Credentials) [$CFOPS_ADMIN_USER]
   --adminpass, --dp 		password for Ops Mgr admin (Ops Manager WebConsole Credentials) [$CFOPS_ADMIN_PASS]
   --opsmanageruser, --omu 	username for Ops Manager VM Access (used for ssh connections) [$CFOPS_OM_USER]
   --opsmanagerpass, --omp 	password for Ops Manager VM Access (used for ssh connections) [$CFOPS_OM_PASS]
   --destination, -d 		path of the Cloud Foundry archive [$CFOPS_DEST_PATH]</pre>

5. Backup Ops Manager using <code>cfops backup ></code><pre class='terminal'>
    $ ../cfops backup --opsmanagerhost x.x.x.x --omp x  --du xxx --dp xxx --omu ubuntu -d . -t ops-manager
       </pre>


6. Once the backup completes, you should see <code>opsmanager</code> backup directoy with following files <pre class='terminal'>  ubuntu@ip-10-0-0-154:~/cfops/pipeline/output/builds/linux64$ ls -l
total 11068
-rwxr-xr-x 1 ubuntu ubuntu 11327680 Jan 18 15:11 cfops
drwxrwxr-x 2 ubuntu ubuntu     4096 Jan 18 19:38 opsmanager ubuntu@ip-10-0-0-154:~/cfops/pipeline/output/builds/linux64$ cd opsmanager/
ubuntu@ip-10-0-0-154:~/cfops/pipeline/output/builds/linux64/opsmanager$ ls
deployments.tar.gz  installation.json  installation.zip
ubuntu@ip-10-0-0-154:~/cfops/pipeline/output/builds/linux64/opsmanager$ ls -l
total 4890056
-rw-rw-r-- 1 ubuntu ubuntu      68123 Jan 18 19:38 deployments.tar.gz
-rw-rw-r-- 1 ubuntu ubuntu     106260 Jan 18 19:38 installation.json
-rw-rw-r-- 1 ubuntu ubuntu 5007234059 Jan 18 19:45 installation.zip

__Note: __
1. AWS requires the pem files as authentication mechanisms for ssh into virtual machines. cfops tool will extract the pem file from Ops manager when taking backups from CF virtual machines. Also note that you should provide a dummy password (--omp x )for ops manager host when executing backup command. 2. cfops manager backup command can be run with LOG Level DEBUG mode <pre class='terminal'>
$LOG_LEVEL=debug ./cfops backup --opsmanagerhost xx.xx.xx.xx --omp x  --du xxx --dp xxx --omu ubuntu -d . -t ops-manager
</pre>

#-*- coding: utf-8 -*-
'''---------------------------------
	
	
	Created on 2014. 11. 5.
	@author: Bong-Jin Kwon
---------------------------------'''
from spidercore import *
from fabric.api import env
from fabric.tasks import execute
from spidercore import FabricUtilNFV
from spidercore.util import PyUtils


logger = logging.getLogger(__name__)


def get_bonding(vmid, bondid):
	vm = get_vm(vmid)
	
	addr = vm['mgraddr']

	results = {}
	nics = FabricUtilNFV.getInterfaces(addr, vm['sshid'], vm['sshpw'], None)
	bonding = {}
	
	for nic in nics:
		logger.debug(bondid + ": " + nic['ethName'])
		if bondid == nic['ethName']:
			bonding[bondid] = nic
			bonding['ethernets'] = []
			bonding['disables'] = []
			results['success'] = 'success'
			
		elif nic.has_key('bond-group') and bondid == nic['bond-group']:
			bonding['ethernets'].append(nic['ethName'])
		elif nic.has_key('bond-group'):
			bonding['disables'].append(nic['ethName'])
		
	if results.has_key('success'):
		results['msg'] = json.dumps(bonding)
	else:
		results['success'] = 'fail'
		results['errmsg'] = 'bonding not found.'

	return results

def create_bonding_task(bondinfo):
	
	bondid = bondinfo['bondid']
	commands = []
	commands.append("$DELETE interfaces bonding " + bondid)
	commands.append("$SET interfaces bonding " + bondid)
	commands.append("$SET interfaces bonding %s address %s" % (bondid, bondinfo['address']))
	commands.append("$SET interfaces bonding %s mode %s" % (bondid, bondinfo['mode']))
	
	for ethernet in bondinfo['ethernets']:
		commands.append("$DELETE interfaces ethernet %s bond-group" % ethernet)
		commands.append("$DELETE interfaces ethernet %s address" % ethernet)
		commands.append("$SET interfaces ethernet %s bond-group %s " % (ethernet, bondid))
	
	return FabricUtilNFV.send_vyatta_command(commands)

def create_bonding(vmid, params):
	
	logger.debug("create call!!")
	
	vm = get_vm(vmid)
	
	addr = vm['mgraddr']
	
	env.hosts = [ addr ]
	env.user = vm['sshid']
	env.password = vm['sshpw']
	env.shell = '/bin/vbash -ic'
	
	results = execute(create_bonding_task, hosts=[addr], bondinfo = params)

	return results[addr]
	
def all_bonding(vmid):
	vm = get_vm(vmid)
	addr = vm['mgraddr']
	
	result = []
	bond_dic = {}
	
	nics = FabricUtilNFV.getInterfaces(addr, vm['sshid'], vm['sshpw'], None)
	
	logger.debug(json.dumps(nics, indent=4))
	
	#bonging 정보만 추출.
	for nic in nics:
		if nic["ethName"].startswith("bond"):
			nic['ethernets'] = []
			nic['config'] = FabricUtilNFV.get_vyatta_conf(vmid, "$SHOW interfaces")
			bond_dic[nic["ethName"]] = nic
		elif nic.has_key('bond-group'):
			bond_dic[nic["bond-group"]]['ethernets'].append(nic["ethName"])
	
	for bond_id in bond_dic:
		result.append(bond_dic[bond_id])
	
	
	return result

def update_bonding_task(bondid, bondinfo):
	
	commands = []
	
	for eth in bondinfo['before_eths']:
		commands.append("$DELETE interfaces ethernet %s bond-group" % eth)
	
	for key in bondinfo:
		if '_' in 'ipv6_address':
			_key = key.replace('_',' ')
		else:
			_key = key
			
		if key == 'before_eths':
			continue
			
		if key == 'ethernets':
			for eth in bondinfo[key]:
				commands.append("$SET interfaces ethernet %s bond-group %s" % (eth, bondid))
		else:
			commands.append("$DELETE interfaces bonding %s %s" % (bondid, _key))
			if len(bondinfo[key]) > 0:
				commands.append("$SET interfaces bonding %s %s %s" % (bondid, _key, bondinfo[key]))
			
		
	
	return FabricUtilNFV.send_vyatta_command(commands)

def update_bonding(vmid, params):
	
	logger.debug("update call!!")
	
	diff = PyUtils.diff_vyatta_conf(params['before'], params['after'])
	
	diff['before_eths'] = params['before']['ethernets']
	
	if len(diff) == 0:
		logger.debug("bondging 수정사항이 없습니다.")
		return {"success": "success", "msg": "수정 사항이 없습니다."}
	
	vm = get_vm(vmid)
	addr = vm['mgraddr']
	
	env.hosts = [ addr ]
	env.user = vm['sshid']
	env.password = vm['sshpw']
	env.shell = '/bin/vbash -ic'
	results = execute(update_bonding_task, hosts=[addr], bondid=params['bondid'], bondinfo = diff)
	
	return results[addr]
	
def delete_bonding_task(bondinfo):
	bondid = bondinfo['bondid']
	commands = []
	
	for eth in bondinfo["ethernets"]:
		commands.append("$DELETE interfaces ethernet %s bond-group" % eth)
	
	commands.append("$DELETE interfaces bonding " + bondid)
		
	return FabricUtilNFV.send_vyatta_command(commands)
	
def delete_bonding(vmid, params):
	vm = get_vm(vmid)
	addr = vm['mgraddr']
	
	env.hosts = [ addr ]
	env.user = vm['sshid']
	env.password = vm['sshpw']
	env.shell = '/bin/vbash -ic'
	results = execute(delete_bonding_task, hosts=[addr], bondinfo = params)

	return results[addr]
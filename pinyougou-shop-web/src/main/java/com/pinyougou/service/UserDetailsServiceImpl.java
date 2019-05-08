package com.pinyougou.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;

public class UserDetailsServiceImpl implements UserDetailsService {
	
	//需要调用服务层的方法查找商家(用户名和密码和状态)
	private SellerService SellerService;
	
	public void setSellerService(SellerService sellerService) {
		SellerService = sellerService;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		System.out.println("经过了UserDetailsServiceImpl认证类");
		
		//构建角色列表
		List<GrantedAuthority> grantAuths=new ArrayList<>();
		grantAuths.add(new SimpleGrantedAuthority("ROLE_SELLER"));
		
		//获取商家对象
		TbSeller seller=SellerService.findOne(username);
		if(seller!=null) {
			if(seller.getStatus().equals("1")) {
				return new User(username,seller.getPassword(),grantAuths);
			}else {
				return null;
			}
		}else {
			return null;
		}
		
	}

}

package com.pinyougou.sellergoods.service;

import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.TbBrand;

import entity.PageResult;

/**
 * 品牌接口
 * @author asus
 *
 */

public interface BrandService {

	public List<TbBrand> findAll();
	
	public PageResult findPage(int pageNum,int pageSize);
	
	//添加
	public void add(TbBrand brand);
	
	//根据id查找一个
	public TbBrand findOne(Long id);
	
	//修改
	public void update(TbBrand brand);
	
	//删除
	public void delete(Long[] ids);
	
	//根据条件查找
	public PageResult findPage(TbBrand brand,int pageNum,int size);
	
	//返回下拉列表框的数据
	public List<Map> selectOptionList();
	
}

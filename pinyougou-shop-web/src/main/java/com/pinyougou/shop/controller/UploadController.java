package com.pinyougou.shop.controller;

import org.omg.CORBA.PRIVATE_MEMBER;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import entity.Result;
import util.FastDFSClient;

@RestController
@RequestMapping("/upload")
public class UploadController {
	
	@Value("${FILE_SERVER_URL}")
	private String file_server_url;
	
	@RequestMapping("/upload")
	public Result upload(MultipartFile file) {
		
		
		
		String originalFileName=file.getOriginalFilename();
		String extName=originalFileName.substring(originalFileName.lastIndexOf(".")+1);
		
		try {
			FastDFSClient client=new FastDFSClient("classpath:config/fdfs_client.conf");
			String fileId=client.uploadFile(file.getBytes(),extName);
			String url=file_server_url+fileId;//图片完整的服务器地址
			return new Result(true, url);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new Result(false, "上传失败");
		}
	}
}

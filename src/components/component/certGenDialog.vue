<template>
  <div style="height:100%;">
    <el-dialog :visible.sync="dialogVisible" fullscreen @opened="previewMainEvent">
      <el-dialog
        fullscreen
        @opened="previewCertEvent"
        title="预览证书"
        align="center"
        :visible.sync="innerVisible"
        append-to-body>
      <div style="position: absolute;right: 100px;top: 50px">
          <el-button type="primary" size="small" @click="downloadImage" :loading="isExportLoading">保存</el-button>
        </div>
        <div id="previewCertificate" style="width:100%;height:1200px;">
        </div>
      </el-dialog>
      <div slot="title">
        <div
          style="color:#303133;font-weight:600;font-size:32px;text-align:center;margin-top:20px;margin-bottom:-20px;">
          编辑结业证书
        </div>
      </div>
      <el-container :style="{height:containHeight+'px',marginTop:'-30px'}">
        <el-header>
          <div style="display:flex;justify-content:flex-end">
            <el-button type="primary" @click.native="onClickExport" :loading="isExportLoading">预览/导出</el-button>
          </div>
        </el-header>
        <div style="display:flex;height:100%;min-width:1200px;">
          <div class="div-is-always-shadow" style="flex:1;height:95%;padding:20px;">
            <el-tabs tab-position="left" type="border-card" style="height:100%;" @tab-click="handleClick" v-model="activeName">
              <el-tab-pane label="模板名称" name="first">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_0.text" placeholder="请输入模板名称"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="学校名称">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_1.text" placeholder="请输入学校名称"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_1.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_1.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_1.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_1.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_1.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_1.margin" :step="1"
                                     :max="baseInfo.line_1.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_1.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_1.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="中文主标题">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_2.text" placeholder="请输入中文主标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_2.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_2.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_2.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_2.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_2.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_2.margin" :step="1"
                                     :max="baseInfo.line_2.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_2.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_2.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="英文主标题">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_3.text" placeholder="请输入英文主标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_3.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_3.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_3.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_3.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_3.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_3.margin" :step="1"
                                     :max="baseInfo.line_3.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_3.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_3.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="中文副标题">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_4.text" placeholder="请输入中文副标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_4.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_4.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_4.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_4.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_4.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_4.margin" :step="1"
                                     :max="baseInfo.line_4.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_4.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_4.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="英文副标题">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_5.text" placeholder="请输入英文副标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_5.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_5.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_5.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_5.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_5.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_5.margin" :step="1"
                                     :max="baseInfo.line_5.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_5.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_5.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="文本输入框">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_6.text" placeholder="请输入边框内容"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_6.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_6.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_6.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_6.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_6.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_6.margin" :step="1"
                                     :max="baseInfo.line_6.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_6.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_6.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="中文证书内容">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_7.text" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"
                              placeholder="请输入中文证书内容"></el-input>
                  </el-form-item>
                  <el-form-item label="文本宽度">
                    <el-slider v-model="baseInfo.line_7.width" :min="0" :max="1200" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_7.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_7.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_7.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_7.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_7.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_7.margin" :step="1"
                                     :max="baseInfo.line_7.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_7.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_7.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="英文证书内容">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_8.text" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"
                              placeholder="请输入英文证书内容"></el-input>
                  </el-form-item>
                  <el-form-item label="文本宽度">
                    <el-slider v-model="baseInfo.line_8.width" :min="0" :max="1200" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_8.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_8.weight" show-stops :min="0" :max="1000" :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="对其方式">
                    <el-radio v-model="baseInfo.line_8.align" label="left">左对齐</el-radio>
                    <el-radio v-model="baseInfo.line_8.align" label="center">居中</el-radio>
                    <el-radio v-model="baseInfo.line_8.align" label="right">右对齐</el-radio>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_8.margin" :step="1"
                                     :max="baseInfo.line_8.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_8.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_8.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="装饰图片">
                <el-form label-width="80px">
                  <el-form-item label="上传图片">
                    <el-upload
                      ref="upload1"
                      :limit="1"
                      :action="uploadImage"
                      :file-list="fileListImage"
                      :on-change="handleChangeImage"
                      :on-remove="handleRemoveImage"
                      :on-success="handelSuccess"
                      :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadImage">上传到服务器</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="图片大小">
                    <el-slider v-model="oteerImgStyle" :min="0.1" :max="3" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距顶距离">
                    <el-slider v-model="baseInfo.line_9.top" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距右距离">
                    <el-slider v-model="baseInfo.line_9.right" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_9.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!--              last-->
              <el-tab-pane label="发证日期">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_10.text" placeholder="请输入英文主标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_10.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_10.weight" show-stops :min="0" :max="1000"
                               :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="距顶距离">
                    <el-slider v-model="baseInfo.line_10.top" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距右距离">
                    <el-slider v-model="baseInfo.line_10.right" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <!--                  <el-form-item label="对其方式">-->
                  <!--                    <el-radio v-model="baseInfo.line_10.align" label="left">左对齐</el-radio>-->
                  <!--                    <el-radio v-model="baseInfo.line_10.align" label="center">居中</el-radio>-->
                  <!--                    <el-radio v-model="baseInfo.line_10.align" label="right">右对齐</el-radio>-->
                  <!--                  </el-form-item>-->
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_10.margin" :step="1"
                                     :max="baseInfo.line_10.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_10.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_10.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="机构logo">
                <el-form label-width="80px">
                  <el-form-item label="上传图片">
                    <el-upload
                      ref="upload"
                      :limit="1"
                      :file-list="fileListLogo"
                      :on-remove="handleRemoveLogo"
                      :on-success="handelLogo"
                      :on-progress="handelProgress"
                      :on-change="handleChangeLogo"
                      :action=uploadImage
                      :auto-upload="false"
                     >
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadLogo">上传到服务器</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="图片大小">
                    <el-slider v-model="oteerLogoStyle" :min="0.1" :max="3" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距顶距离">
                    <el-slider v-model="baseInfo.line_11.top" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距右距离">
                    <el-slider v-model="baseInfo.line_11.right" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_11.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="公司全称">
                <el-form label-width="80px">
                  <el-form-item label="文本内容">
                    <el-input v-model="baseInfo.line_12.text" placeholder="请输入英文主标题"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-slider v-model="baseInfo.line_12.size" :min="0" :max="10" :step="0.1"></el-slider>
                  </el-form-item>
                  <el-form-item label="字体粗细">
                    <el-slider v-model="baseInfo.line_12.weight" show-stops :min="0" :max="1000"
                               :step="100"></el-slider>
                  </el-form-item>
                  <el-form-item label="距顶距离">
                    <el-slider v-model="baseInfo.line_12.top" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="距右距离">
                    <el-slider v-model="baseInfo.line_12.right" :min="-2000" :max="2000" :step="1"></el-slider>
                  </el-form-item>
                  <el-form-item label="文本间距">
                    <el-input-number v-model="baseInfo.line_12.margin" :step="1"
                                     :max="baseInfo.line_12.maxMargin"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="baseInfo.line_12.color" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="是否显示">
                    <el-switch v-model="baseInfo.line_12.show" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="div-is-always-shadow" style="flex:3;height:95%;padding:20px;margin-left:20px;">
            <div class="div-is-always-shadow-bg"
                 style="height:100%;display:flex;flex-direction:column;width:100%;flex:1" id="capture">
              <div style="background-color:#09d4ff;height:40px;border:none;"></div>
              <div style="flex:1;border:none;background-color: #ffffff;position: relative" class="backgroundBox">
                <div v-show="baseInfo.line_1.show"
                     :style="{color:baseInfo.line_1.color,fontSize:baseInfo.line_1.size+'rem',textAlign:baseInfo.line_1.align,margin:baseInfo.line_1.margin+'px 0',fontWeight:baseInfo.line_1.weight}">
                  {{baseInfo.line_1.text}}
                </div>
                <div v-show="baseInfo.line_2.show"
                     :style="{color:baseInfo.line_2.color,fontSize:baseInfo.line_2.size+'rem',textAlign:baseInfo.line_2.align,margin:baseInfo.line_2.margin+'px 0',fontWeight:baseInfo.line_2.weight}">
                  {{baseInfo.line_2.text}}
                </div>
                <div v-show="baseInfo.line_3.show"
                     :style="{color:baseInfo.line_3.color,fontSize:baseInfo.line_3.size+'rem',textAlign:baseInfo.line_3.align,margin:baseInfo.line_3.margin+'px 0',fontWeight:baseInfo.line_3.weight}">
                  {{baseInfo.line_3.text}}
                </div>
                <div v-show="baseInfo.line_4.show"
                     :style="{color:baseInfo.line_4.color,fontSize:baseInfo.line_4.size+'rem',textAlign:baseInfo.line_4.align,margin:baseInfo.line_4.margin+'px 0',fontWeight:baseInfo.line_4.weight}">
                  {{baseInfo.line_4.text}}
                </div>
                <div v-show="baseInfo.line_5.show"
                     :style="{color:baseInfo.line_5.color,fontSize:baseInfo.line_5.size+'rem',textAlign:baseInfo.line_5.align,margin:baseInfo.line_5.margin+'px 0',fontWeight:baseInfo.line_5.weight}">
                  {{baseInfo.line_5.text}}
                </div>
                <div v-show="baseInfo.line_6.show"
                     :style="{color:baseInfo.line_6.color,fontSize:baseInfo.line_6.size+'rem',textAlign:baseInfo.line_6.align,marginTop:baseInfo.line_6.margin+'px',fontWeight:baseInfo.line_6.weight}">
                  {{baseInfo.line_6.text}}
                </div>
                <div v-show="baseInfo.line_7.show"
                     :style="{display:'flex',justifyContent:'center',alignItems:baseInfo.line_7.align,marginTop:baseInfo.line_7.margin+'px'}">
                  <div
                    :style="{color:baseInfo.line_7.color,fontSize:baseInfo.line_7.size+'rem',fontWeight:baseInfo.line_7.weight,width:baseInfo.line_7.width+'px'}">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{baseInfo.line_7.text}}</span></div>
                </div>
                <div v-show="baseInfo.line_8.show"
                     :style="{display:'flex',justifyContent:'center',alignItems:baseInfo.line_8.align,marginTop:baseInfo.line_8.margin+'px'}">
                  <div
                    :style="{color:baseInfo.line_8.color,fontSize:baseInfo.line_8.size+'rem',fontWeight:baseInfo.line_8.weight,width:baseInfo.line_8.width+'px'}">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{baseInfo.line_8.text}}</span></div>
                </div>
                <div v-show="baseInfo.line_9.show"
                     :style="{display:'flex',justifyContent:'center',alignItems:'center',marginTop:baseInfo.line_9.margin+'px'}">
                  <div :style="{width:'90%',position:'relative'}">
                    <el-image
                      :style="{width:baseInfo.line_9.imgWidth+'px',height:baseInfo.line_9.imgHeight+'px',position:'absolute',top:baseInfo.line_9.top+'px',right:baseInfo.line_9.right+'px'}"
                      :src="baseInfo.medal"></el-image>
                  </div>
                </div>
                <div :style="{marginTop:baseInfo.line_10.margin+'px'}">
                  <div :style="{width:'60%',margin:'auto'}">
                    <div :style="{display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}">
                      <div v-show="baseInfo.line_10.show"
                           :style="{flex:1,color:baseInfo.line_10.color,fontSize:baseInfo.line_10.size+'rem',margin:baseInfo.line_10.margin+'px 0',fontWeight:baseInfo.line_10.weight,position:'absolute',top:baseInfo.line_10.top+'px',right:baseInfo.line_10.right+'px'}">
                        {{baseInfo.line_10.text}}
                      </div>
                      <div v-show="baseInfo.line_11.show"
                           :style="{flex:2,justifyContent:'center',alignItems:'center',marginTop:baseInfo.line_11.margin+'px'}">
                        <div
                          :style="{position:'absolute',top:baseInfo.line_11.top+'px',right:baseInfo.line_11.right+'px'}">
                          <el-image
                            :style="{width:baseInfo.line_11.imgWidth+'px',height:baseInfo.line_11.imgHeight+'px'}"
                            :src="baseInfo.logo"></el-image>
                        </div>
                      </div>
                      <div v-show="baseInfo.line_12.show"
                           :style="{flex:1,color:baseInfo.line_12.color,fontSize:baseInfo.line_12.size+'rem',margin:baseInfo.line_12.margin+'px 0',fontWeight:baseInfo.line_12.weight,position:'absolute',top:baseInfo.line_12.top+'px',right:baseInfo.line_12.right+'px'}">
                        {{baseInfo.line_12.text}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="background-color:#09d4ff;height:40px;border:none;"></div>
            </div>
          </div>
        </div>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
    import $ from 'jquery'
    import PubSub from 'pubsub-js'
    import html2canvas from 'html2canvas'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import {qs, uploadFileUrl, saveEduReporter, uploadOriginBase64} from '../../api/api'

    export default {
        name: "certGenDialog",
        data() {
            return {
                uploadImage: uploadFileUrl,
                containHeight: '',
                canvasImgSrc: '',
                innerVisible: false,
                dialogVisible: false,
                screenShot: null,
                currentActive: '',
                screenShotWidth: 0,
                screenShotHeight: 0,
                isExportLoading: false,
                oteerImgStyle: 1,
                oteerLogoStyle: 1,
                otherImgSize: {width: 0, height: 0},
                fileListImage: [],
                fileListLogo: [],
                info: {},
                baseInfo: {},
                activeName:'first',//选择第一项
                logoStatus:false,//是否点击logo上传服务器
                imageStatus:false,//是否点击装饰图片上传服务器
                uploadImageSuccess:'',//上传装饰图片存储图片地址
                uploadLogoSuccess:'',//上传logo存储图片地址
                saveImageSize:'',
                saveLogoSize:'',

            }
        },
        watch: {
            oteerImgStyle(val) {
                if (this.otherImgSize.width == 0) {
                    this.otherImgSize.width = this.baseInfo.line_9.imgWidth
                }
                if (this.otherImgSize.height == 0) {
                    this.otherImgSize.height = this.baseInfo.line_9.imgHeight
                }
                this.baseInfo.line_9.imgWidth = val * this.otherImgSize.width
                this.baseInfo.line_9.imgHeight = val * this.otherImgSize.height
            },
            oteerLogoStyle(val) {
                if (this.otherImgSize.width == 0) {
                    this.otherImgSize.width = this.baseInfo.line_11.imgWidth
                }
                if (this.otherImgSize.height == 0) {
                    this.otherImgSize.height = this.baseInfo.line_11.imgHeight
                }
                this.baseInfo.line_11.imgWidth = val * this.otherImgSize.width
                this.baseInfo.line_11.imgHeight = val * this.otherImgSize.height
            }
        },
        created() {
            this.initData()
            this.containHeight =
                (window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight) * 0.9
        },
        methods: {
            //change装饰图片
            handleChangeImage(file, fileList) {
                let reader = new FileReader();
                const _that = this
                reader.readAsDataURL(file.raw);
                reader.onload = function () {
                    _that.baseInfo.medal = this.result;
                    var img = document.createElement("img")
                    img.setAttribute("src", this.result)
                    setTimeout(function () {
                        _that.otherImgSize.height = img.height * _that.baseInfo.line_9.imgSize
                        _that.otherImgSize.width = img.width * _that.baseInfo.line_9.imgSize
                    }, 0)
                }
                if(this.imageStatus==false){
                    this.oteerImgStyle=1
                }else{
                    this.oteerImgStyle=this.saveImageSize
                }
            },
            handleRemoveImage(file, fileList) {
                console.log("handleRemoveImage-file", file)
                console.log("handleRemoveImage-fileList", fileList)
                console.log("this.fileListImage", this.fileListImage)
            },
            //装饰图片上传服务器
            submitUploadImage() {
                this.$refs.upload1.submit();
                this.imageStatus=true

            },
            //装饰上传成功回调
            handelSuccess(response, file, fileList) {
                this.saveImageSize=this.oteerImgStyle
                this.baseInfo.medal=""
                this.uploadImageSuccess=response
                this.baseInfo.line_9.imgSize=1
            },
           //change 机构logo
            handleChangeLogo(file, fileList) {
                let reader = new FileReader();
                const _that = this
                reader.readAsDataURL(file.raw);
                reader.onload = function () {
                    _that.baseInfo.logo = this.result;
                    var img = document.createElement("img")
                    img.setAttribute("src", this.result)
                    setTimeout(function () {
                        _that.otherImgSize.height = img.height * _that.baseInfo.line_11.imgSize
                        _that.otherImgSize.width = img.width * _that.baseInfo.line_11.imgSize
                        _that.baseInfo.line_11.imgWidth = img.width
                    }, 100)
                }
                if(this.logoStatus==false){
                    this.oteerLogoStyle=1
                }else{
                    this.oteerLogoStyle=this.saveLogoSize
                }
            },
            handleRemoveLogo(file, fileList) {
                console.log("handleRemoveImage-file", file)
                console.log("handleRemoveImage-fileList", fileList)
                console.log("this.fileListLogo", this.fileListLogo)
            },
            //logo上传成功回调
            handelLogo(response, file, fileList) {
                this.saveLogoSize=this.oteerLogoStyle
                this.baseInfo.logo=""
                this.uploadLogoSuccess=response
            },
            submitUploadLogo() {
                this.$refs.upload.submit();
                this.logoStatus=true
            },
            handleClick(tab) {
                this.currentActive = tab.index
            },

            handelProgress(event, file, fileList){
                console.log("event",event)
            },
            previewCertEvent() {
                $("#previewCertificate").empty()
                $("#previewCertificate").append(this.screenShot)
            },
            onClickExport() {
                this.isExportLoading = true
                html2canvas(document.querySelector("#capture")).then(canvas => {
                    canvas.style.position = 'absolute'
                    canvas.style.left = '50%'
                    canvas.style.transform = 'translate(-50%)'
                    this.screenShot = canvas
                    this.isExportLoading = false
                    this.innerVisible = true
                    this.convertCanvasToImage(canvas)
                }).catch(err => {
                    promptUtil.LOG('html2canvas-err', err)
                    this.isExportLoading = false
                });
            },
            // 保存下载
            downloadImage() {
                if(this.logoStatus==false){
                    this.baseInfo.logo=""
                }else{
                    this.baseInfo.logo=this.uploadLogoSuccess
                }
                if(this.imageStatus==false){
                   this.baseInfo.medal=""
                }else{
                    this.baseInfo.medal=this.uploadImageSuccess
                }
                uploadOriginBase64(qs.stringify({
                    file: this.canvasImgSrc
                })).then(res => {
                    this.isExportLoading = false
                    if (res.code == SUCCESS_CODE) {
                        saveEduReporter(qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            teacher_id: storageUtil.readTeacherInfo().id,
                            name: this.baseInfo.line_0.text,
                            img: res.data.url,
                            json: JSON.stringify({info:'需要解决传递图片的问题'})//JSON.stringify(this.baseInfo)
                        })).then(res => {
                            this.isExportLoading = false
                            if (res.code == SUCCESS_CODE) {
                                PubSub.publish("getCertList", "yes");
                                this.innerVisible = false
                                this.dialogVisible = false
                                promptUtil.success(this, res.msg)
                            } else {
                                promptUtil.warning(this, res.msg)
                            }
                        }).catch(err => {
                            this.isExportLoading = false
                            promptUtil.LOG('saveEduReporter-err', err)
                        })
                    } else {
                        promptUtil.warning(this, res.msg)
                    }
                }).catch(err => {
                    this.isExportLoading = false
                    promptUtil.LOG('uploadOriginBase64-err', err)
                })
            },
            convertCanvasToImage(canvas) {
                let _that=this
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                this.canvasImgSrc = image.src
                return image;
            },
            previewMainEvent() {
                this.screenShotWidth = $("#capture").width()
                this.screenShotHeight = $("#capture").height()
                this.baseInfo.line_1.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_1.maxMargin = this.baseInfo.line_1.margin * 3
                this.baseInfo.line_2.margin = parseInt((this.screenShotHeight * 0.05) + "")
                this.baseInfo.line_2.maxMargin = this.baseInfo.line_2.margin * 3
                this.baseInfo.line_3.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_3.maxMargin = this.baseInfo.line_3.margin * 3
                this.baseInfo.line_4.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_4.maxMargin = this.baseInfo.line_4.margin * 3
                this.baseInfo.line_5.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_5.maxMargin = this.baseInfo.line_5.margin * 3
                this.baseInfo.line_6.margin = parseInt((this.screenShotHeight * 0.1) + "")
                this.baseInfo.line_6.maxMargin = this.baseInfo.line_6.margin * 3
                this.baseInfo.line_7.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_7.maxMargin = this.baseInfo.line_7.margin * 3
                this.baseInfo.line_8.margin = parseInt((this.screenShotHeight * 0.02) + "")
                this.baseInfo.line_8.maxMargin = this.baseInfo.line_8.margin * 3
                this.baseInfo.line_9.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_9.maxMargin = this.baseInfo.line_9.margin * 3
                this.baseInfo.line_9.top = (this.screenShotHeight * 0.1) * -1
                this.baseInfo.line_10.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_10.maxMargin = this.baseInfo.line_10.margin * 3
                this.baseInfo.line_10.right = (this.screenShotWidth / 2) + (this.baseInfo.line_11.imgWidth / 2 + 50)
                this.baseInfo.line_10.top = this.screenShotHeight - 160
                this.baseInfo.line_11.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_11.maxMargin = this.baseInfo.line_9.margin * 3
                this.baseInfo.line_11.right = (this.screenShotWidth / 2) - (this.baseInfo.line_11.imgWidth / 2 - 10)
                this.baseInfo.line_11.top = this.screenShotHeight - 180
                this.baseInfo.line_12.margin = parseInt((this.screenShotHeight * 0.04) + "")
                this.baseInfo.line_12.maxMargin = this.baseInfo.line_10.margin * 3
                this.baseInfo.line_12.right = (this.screenShotWidth / 2) - (this.baseInfo.line_11.imgWidth)
                this.baseInfo.line_12.top = this.screenShotHeight - 160
            },

            show(obj) {
                this.initData()
                this.info = obj
                this.dialogVisible = true
            },
            hide(status = true) {
                this.release(status)
                this.dialogVisible = false
            },
            release(status) {
                if (status) { // 清空数据

                } else { // 保留数据

                }
            },
            initData() {
                this.activeName='first'
                this.logoStatus=false
                this.imageStatus=false
                this.fileListImage= []
                this.fileListLogo= []
                this.baseInfo = {
                    logo: require('../../../static/images/base/cert/alsrobot.png'),
                    medal: require('../../../static/images/base/cert/medal.png'),
                    line_0: {text: '自定义模板'},
                    line_1: {
                        show: true,
                        align: 'center',
                        text: storageUtil.readTeacherInfo().school_name,
                        color: '#ff9900',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 400
                    },
                    line_2: {
                        show: true,
                        align: 'center',
                        text: 'CERTIFICATE OF GRADUATION',
                        color: '#09d4ff',
                        size: 3,
                        margin: 0,
                        maxMargin: 0,
                        weight: 400
                    },
                    line_3: {
                        show: true,
                        align: 'center',
                        text: '结业证书',
                        color: '#303133',
                        size: 3.6,
                        margin: 0,
                        maxMargin: 0,
                        weight: 700
                    },
                    line_4: {
                        show: true,
                        align: 'center',
                        text: '兹证明',
                        color: '#303133',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 400
                    },
                    line_5: {
                        show: true,
                        align: 'center',
                        text: 'This is to certify that',
                        color: '#303133',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 400
                    },
                    line_6: {
                        show: true,
                        align: 'center',
                        text: '— — — — — — — — — —',
                        color: '#303133',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 400
                    },
                    line_7: {
                        show: true,
                        align: 'center',
                        text: '顺利完成' + storageUtil.readTeacherInfo().school_name + '教育中心“STEAM-X科创教育”课程，表现优秀，特发此证。',
                        color: '#303133',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 600,
                        width: 660
                    },
                    line_8: {
                        show: true,
                        align: 'center',
                        text: 'successually completed the XXXXXX Education Center "STEAM-X Creative Education"curriculum,outstanding performance,specially issued this certificate.',
                        color: '#303133',
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        weight: 500,
                        width: 660
                    },
                    line_9: {
                        show: true,
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        top: 0,
                        right: 0,
                        imgWidth: 152,
                        imgHeight: 216,
                        imgSize: 1,
                        pictureImage:'',
                        fit: 'contain',
                        options: [{value: 'fill', name: '填满'}, {value: 'contain', name: '包含'}, {
                            value: 'cover',
                            name: '覆盖'
                        }, {value: 'scale-down', name: '缩小'}, {value: 'none', name: '无'}]
                    },
                    line_10: {
                        show: true,
                        top: 0,
                        right: 922,
                        text: 'Date:',
                        color: '#303133',
                        size: 0.7,
                        margin: 0,
                        maxMargin: 0,
                        weight: 700
                    },
                    line_11: {
                        imgSize: 1,
                        show: true,
                        size: 1,
                        margin: 0,
                        maxMargin: 0,
                        top: 0,
                        right: 0,
                        imgWidth: 343,
                        imgHeight: 103,
                        logoImage:'',
                        fit: 'contain',
                        options: [{value: 'fill', name: '填满'}, {value: 'contain', name: '包含'}, {
                            value: 'cover',
                            name: '覆盖'
                        }, {value: 'scale-down', name: '缩小'}, {value: 'none', name: '无'}]
                    },
                    line_12: {
                        show: true,
                        top: 0,
                        right: 0,
                        text: '黑龙江奥松汇创教育科技有限公司',
                        color: '#303133',
                        size: 0.7,
                        margin: 0,
                        maxMargin: 0,
                        weight: 700
                    },
                }
            }
        }
    }
</script>

<style scoped>
  .div-is-always-shadow {
    box-shadow: -2px 0px 3px 1px #E6E6E6, 0px -2px 3px 1px #E6E6E6, 2px 0px 3px 1px #E6E6E6, 0px 2px 3px 1px #E6E6E6;
  }

  .div-is-always-shadow-bg {
    box-shadow: -2px 0px 5px 1px #E6E6E6, 0px -2px 5px 1px #E6E6E6, 2px 0px 5px 1px #E6E6E6, 0px 2px 5px 1px #E6E6E6;
  }

</style>

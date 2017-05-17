function imagesUpload (ele, options) {
  // 判断容器元素是或否唯一，唯一添加基础元素。
  var eleList = document.querySelectorAll(ele);
  if (eleList.length === 0) {
    console.log('element is null');
    return;
  } else if (eleList.length > 1) {
    console.log('element is not only');
    return;
  } else {
    var imgUpAdd = '<div class="img-up-add img-item"> <span class="img-add-icon">+</span> </div>';
    var inputEle = '<input type="file" name="files" id="img-file-input" multiple="multiple">';
    var imgContainer = '<div id="img-container">' + imgUpAdd + inputEle + '</div>'
    eleList[0].innerHTML = imgContainer;
    var imgContainerEle = eleList[0].querySelector('#img-container');

    // 当前上传文件的文件数组。
    imgContainerEle.files = [];
  }

  // 为添加按钮绑定点击事件，设置选择图片的功能。
  var addBtn = document.querySelector('.img-up-add');
  addBtn.addEventListener('click', function () {
    document.querySelector('#img-file-input').value = null;
    document.querySelector('#img-file-input').click();
    return false;
  }, false)

  // 处理input选择的图片，预览图片。
  function handleFileSelect (event) {
    var files = event.target.files;

    for (var i = 0, f; f = files[i]; i++) {

      // 过滤非图片类型的文件。
      if(!f.type.match('image.*')){
        continue;
      }

      // 过滤掉重复上传的图片。
      var repeat = false;
      var len = imgContainerEle.files.length

      for (var j = 0; j < len; j++) {
        if((imgContainerEle.files)[j].name == f.name){
          tip = true;
          break;
        }
      }

      if (!repeat) {
        // 图片文件绑定到容器元素上
        imgContainerEle.files.push(f);

        var reader = new FileReader();
        reader.onload = (function (thisFile) {
          return function (e) {
            var viewDiv = document.createElement('div');
            viewDiv.className = 'img-thumb img-item';

            // 向图片容器里添加元素
            viewDiv.innerHTML = '<img class="thumb-icon" src="' + e.target.result + '" />' + '<a href="javscript:;" class="img-remove">x</a>';

            imgContainerEle.insertBefore(viewDiv, addBtn);
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }
  }

  document.querySelector('#img-file-input').addEventListener('change', handleFileSelect, false);

  // 删除图片
  function removeImg(event) {
    if (event.target.className.match(/img-remove/)) {
      // 获取删除的节点的索引
      function getIndex (ele) {
        if (ele && ele.nodeType && ele.nodeType === 1) {
          var oParent = ele.parentNode;
          var oChilds = oParent.children;
          for (var i = 0; i < oChilds.length; i++) {
            if(oChilds[i] == ele) return i;
          }
        } else {
          return -1;
        }
      }
      // 根据索引删除指定的文件对象

      var index = getIndex(event.target.parentNode);
      imgContainerEle.removeChild(event.target.parentNode);

      if (index < 0) {
        return;
      } else {
        imgContainerEle.files.splice(index, 1);
      }
    }
  }
  imgContainerEle.addEventListener('click', removeImg, false);

  // 上传图片
  function uploadImg () {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();

    for (var i = 0, f; f = imgContainerEle.files[i]; i++) {
      formData.append('files', f);
    }

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          options.success(xhr.reponseText);
        } else {
          options.fail(xhr.reponseText);
        }
      }
    }

    xhr.open('POST', options.path, true);
    xhr.send(formData);
  }

  return uploadImg;
}

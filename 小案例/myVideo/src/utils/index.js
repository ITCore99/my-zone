/**拖拽的封装 */
(function(window) {

  function Drag(element,callback) {
      this.element = element;
      this.callback = callback;

      Drag.prototype.drag = function() {

        //开始时节点的位置
        var startElementPoint = {
            x:0,
            y:0
        }
        //开始时鼠标的位置
        var startMousePoint = {
            x:0,
            y:0
        }

        var element = this.element;
        var that = this;
        element.addEventListener('mousedown',handlerMouseDown);
        function handlerMouseDown(event) {
            
            if(element.setCapture) {
                element.setCapture();
            }
           
            startElementPoint.x = element.offsetLeft;
            startElementPoint.y = element.offsetTop;

            startMousePoint.x = event.clientX;
            startMousePoint.y = event.clientY;

            var maxLeft = element.parentNode.offsetWidth - element.offsetWidth;

            document.addEventListener('mousemove',handlerMove);
            function handlerMove(event) {
                var left = startElementPoint.x + (event.clientX - startMousePoint.x );
                if(left < 0) {
                    left = 0;
                }
                if(left > maxLeft) {
                    left = maxLeft;
                }
                element.style.left = left + 'px';
                if(that.callback && that.callback.move && typeof that.callback.move === 'function' ) {
                    that.callback.move(left);
                }
                return false;
            }  
            
            document.addEventListener('mouseup',handlerUp);
            function handlerUp() {
                document.removeEventListener('mousemove',handlerMove);
                document.removeEventListener('mouseup',handlerUp);
            }
            return false;
        }
      }
  }
  window.Drag = Drag;
})(window)
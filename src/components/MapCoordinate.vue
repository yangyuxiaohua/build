<template>
    <div id="mapCoordinateWrapper">
        <!-- 地图定位 -->
        <baidu-map class="bm-view" ak="SNUcFOLFpX4Ra1HxR9OEHdSEdkzyDxll" :center="center" :zoom="zoom" @ready="map_handler" :scroll-wheel-zoom="true" :mapClick="false">
            <bm-marker :position="center" :dragging="true" @dragend='draggEnd($event)'>
                <!-- <bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/> -->
            </bm-marker>
        </baidu-map>
    </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";

export default {
  components: {
    BaiduMap,
    BmMarker
    // BmInfoWindow,
    // BmOverlay,
    // BmLabel
  },
  data() {
    return {
      BMap: {},
      map: {},
      center: { lng: 0, lat: 0 },
      zoom: 3,
    //   selfPoint:{}
    };
  },
  mounted() {
  },
  methods: {
    map_handler({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      // this.center.lng = 102.72;
      // this.center.lat = 25.05;
      if(this.$store.state.point.lat){
        this.center = this.$store.state.point
      }else{
        this.center= { lng:102.72, lat: 25.05 }
      }
      this.zoom = 8;
    },
    draggEnd(event) {
      this.$store.commit('savePoint',event.point)
    },

  }
};
</script>

<style lang="less" scoped>
#mapCoordinateWrapper {
  width: 100%;
  height: 100%;
  .bm-view {
    width: 100%;
    height: 100%;
  }
}
</style>
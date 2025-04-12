
const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true
});

const tleLine1 = "1 25544U 98067A   24101.37881944  .00013423  00000+0  24710-3 0  9992";
const tleLine2 = "2 25544  51.6417  56.7824 0002191 312.0824 147.1770 15.50593720399412";

const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

const satelliteEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(0, 0, 400000),
  point: { pixelSize: 10, color: Cesium.Color.RED },
  label: { text: "ISS", fillColor: Cesium.Color.WHITE }
});

let trailPositions = [];

function updatePosition() {
  const now = new Date();
  const positionAndVelocity = satellite.propagate(satrec, now);
  const gmst = satellite.gstime(now);
  const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
  const longitude = Cesium.Math.toDegrees(positionGd.longitude);
  const latitude = Cesium.Math.toDegrees(positionGd.latitude);
  const height = positionGd.height * 1000;

  const cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
  satelliteEntity.position = new Cesium.ConstantPositionProperty(cartesian);

  trailPositions.push(cartesian);
  viewer.entities.add({
    polyline: {
      positions: trailPositions,
      width: 2,
      material: Cesium.Color.YELLOW
    }
  });
}

setInterval(updatePosition, 1000);

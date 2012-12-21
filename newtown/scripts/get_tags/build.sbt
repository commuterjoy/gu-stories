
resolvers := Seq(
        "Guardian Github Releases" at "http://guardian.github.com/maven/repo-releases",
        Resolver.url("Typesafe Ivy Releases", url("http://repo.typesafe.com/typesafe/ivy-releases"))(Resolver.ivyStylePatterns),
        "JBoss Releases" at "http://repository.jboss.org/nexus/content/repositories/releases",
        "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/",
        "Akka" at "http://repo.akka.io/releases",
	    "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
      )

libraryDependencies ++= Seq(
  "net.databinder.dispatch" %% "dispatch-core" % "0.9.5",
  "com.gu.openplatform" %% "content-api-client" % "1.17",
  "net.liftweb" % "lift-json_2.9.2" % "2.5-SNAPSHOT",
  "org.slf4j" % "slf4j-simple" % "1.6.2",
  "commons-io" % "commons-io" % "2.3",
  "com.codahale" % "jerkson_2.9.1" % "0.5.0"
  )


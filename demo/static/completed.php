<?php require_once 'framework.php'; ?>
<?php get_header('Study Complete | Lesson 3 Japanese Vocabulary | Sleepless Demo', 'completion-page'); ?>
<?php $completion_messages = array("That&rsquo;s it!", "You&rsquo;re Done!", "Congratulations!", "Nice Work!"); ?>
	<header class="six-col pad right-align desc-hd" id="completion-header">
		<h1><?php echo $completion_messages[array_rand($completion_messages)]; ?></h1>
		<p class="desc-shd">You've finished studying <a href="launch.php" title="Return to Deck">Lesson 3 Japanese Vocabulary</a> for today.</p>
	</header>
	
	<ul class="sidebar slow-fade-in" id="completion-sidebar">
		<li class="origami">
			<header class="origami-header">
				<div class="origami-content">
					<p class="origami-num">1:43:29</p>
				</div>
			</header>
			<footer class="origami-footer">
				<p class="origami-caption">Time</p>
			</footer>
		</li>
		<li class="origami" id="completion-cards-today">
			<header class="origami-header">
				<div class="origami-content">
					<p class="origami-num">27</p>
				</div>
			</header>
			<footer class="origami-footer">
				<p class="origami-caption">Today</p>
			</footer>
		</li>
		<li class="origami upcoming" id="completion-cards-tomorrow">
			<header class="origami-header">
				<div class="origami-content">
					<p class="origami-num">2047</p>
				</div>
			</header>
			<footer class="origami-footer">
				<p class="origami-caption">Tomorrow</p>
			</footer>
		</li>
	</ul>
	
	<ul class="six-col pad right-align" id="completion-links">
		<li><a href="launch.php" class="btn full-btn">Return to Deck</a></li>
		<li><a href="index.php" class="btn full-btn">Return Home</a></li>
	</ul>
<?php get_footer('completion-page'); ?>